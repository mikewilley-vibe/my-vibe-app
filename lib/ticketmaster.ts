// lib/ticketmaster.ts
import type { Concert } from "@/lib/concerts/types";

type TMParams = Record<string, string | undefined>;

function toQuery(params: TMParams) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v));
  }
  return sp.toString();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetryableNetworkError(err: unknown) {
  const anyErr = err as any;
  const code = anyErr?.code || anyErr?.cause?.code;
  // Common transient/network/DNS codes you might see in Node
  return (
    code === "ENOTFOUND" ||
    code === "EAI_AGAIN" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED"
  );
}

function snippet(s: string, n = 240) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export function tmToConcert(ev: any): Concert | null {
  const id = ev?.id;
  const name = ev?.name;
  const url = ev?.url;

  const dateTime =
    ev?.dates?.start?.dateTime ||
    ev?.dates?.start?.localDate ||
    "";

  const venueObj = ev?._embedded?.venues?.[0];
  const venue = venueObj?.name ?? "";
  const city = venueObj?.city?.name ?? "";
  const state = venueObj?.state?.stateCode ?? venueObj?.state?.name ?? undefined;

  const images = Array.isArray(ev?.images) ? ev.images : [];
  const image =
    images.find((img: any) => img?.ratio === "16_9" && img?.url)?.url ??
    images[0]?.url ??
    undefined;

  const priceMin = ev?.priceRanges?.[0]?.min;
  const priceMax = ev?.priceRanges?.[0]?.max;

  if (!id || !name || !url) return null;

  return { id, name, dateTime, venue, city, state, url, image, priceMin, priceMax };
}

/**
 * In-memory cache to reduce TM calls (helps avoid 429s).
 * Cache is per unique URL for 5 minutes.
 */
const CACHE_TTL_MS = 5 * 60_000;
const cache = new Map<string, { at: number; data: Concert[] }>();

/**
 * Fetch events from Ticketmaster.
 * IMPORTANT: This function THROWS on upstream failure so your API routes can return ok:false.
 */
export async function fetchTMEvents(params: TMParams): Promise<Concert[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    // Throw so your API route catch() returns ok:false instead of silently empty.
    throw new Error("[TM] Missing TICKETMASTER_API_KEY");
  }

  const url =
    `https://app.ticketmaster.com/discovery/v2/events.json?` +
    toQuery({ ...params, apikey: apiKey });

  // cache
  const cached = cache.get(url);
  const now = Date.now();
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.data;

  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10_000); // 10s timeout

    try {
      const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
      const ct = res.headers.get("content-type") || "";
      const text = await res.text(); // read once

      // 429: retry with backoff
      if (res.status === 429) {
        const wait = 400 * attempt + Math.floor(Math.random() * 300);
        console.warn(
          `[TM] 429 rate-limited. Backing off ${wait}ms (attempt ${attempt}/${maxAttempts})`
        );
        await sleep(wait);
        continue;
      }

      // other non-OK: do NOT pretend it's "no events"
      if (!res.ok) {
        const msg = `[TM] Upstream not ok: ${res.status} ${res.statusText} — ${snippet(text)}`;
        // For 5xx, a retry is sometimes useful
        if (res.status >= 500 && attempt < maxAttempts) {
          const wait = 300 * attempt + Math.floor(Math.random() * 250);
          console.warn(`${msg}. Retrying in ${wait}ms (attempt ${attempt}/${maxAttempts})`);
          await sleep(wait);
          continue;
        }
        throw new Error(msg);
      }

      if (!ct.includes("application/json")) {
        throw new Error(`[TM] Non-JSON response: ${ct} — ${snippet(text)}`);
      }

      const json = JSON.parse(text);
      const raw = json?._embedded?.events;
      const rawEvents = Array.isArray(raw) ? raw : [];

      const concerts = rawEvents.map(tmToConcert).filter(Boolean) as Concert[];

      cache.set(url, { at: Date.now(), data: concerts });
      return concerts;
    } catch (err: any) {
      const aborted = err?.name === "AbortError";
      const retryable = aborted || isRetryableNetworkError(err);

      console.error("[TM] Exception:", err);

      if (attempt < maxAttempts && retryable) {
        const wait = 350 * attempt + Math.floor(Math.random() * 250);
        console.warn(
          `[TM] retryable error (${aborted ? "timeout" : err?.code ?? "network"}). ` +
            `Retrying in ${wait}ms (attempt ${attempt}/${maxAttempts})`
        );
        await sleep(wait);
        continue;
      }

      // Final failure: throw so API route can return ok:false
      throw err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timeout);
    }
  }

  // Shouldn't reach here, but just in case:
  throw new Error("[TM] Exhausted retries");
}