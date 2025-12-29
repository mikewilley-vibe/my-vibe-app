// lib/ticketmaster.ts
import type { Concert } from "@/lib/concerts/types";

type TMParams = Record<string, string | undefined>;

function toQuery(params: TMParams) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).trim() !== "") sp.set(k, String(v));
  }
  return sp.toString();
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

  return {
    id,
    name,
    dateTime,
    venue,
    city,
    state,
    url,
    image,
    priceMin,
    priceMax,
  };
}

/**
 * Tiny in-memory cache (per server instance)
 * - prevents spam refreshes from hammering Ticketmaster
 */
type CacheEntry = { at: number; data: any[]; ttlMs: number };
const g = globalThis as any;
g.__TM_CACHE__ = g.__TM_CACHE__ ?? new Map<string, CacheEntry>();
const CACHE: Map<string, CacheEntry> = g.__TM_CACHE__;

function now() {
  return Date.now();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchTMEvents(params: TMParams, opts?: { ttlSeconds?: number }): Promise<any[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.error("[TM] Missing TICKETMASTER_API_KEY");
    return [];
  }

  const url =
    `https://app.ticketmaster.com/discovery/v2/events.json?` +
    toQuery({ ...params, apikey: apiKey });

  const ttlMs = Math.max(30, opts?.ttlSeconds ?? 180) * 1000; // default 3 min
  const hit = CACHE.get(url);
  if (hit && now() - hit.at < hit.ttlMs) {
    return hit.data;
  }

  // simple retry for 429 spike arrest (tiny delay)
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, { cache: "no-store" });
    const ct = res.headers.get("content-type") || "";
    const text = await res.text(); // read once

    // Rate limited
    if (res.status === 429) {
      console.warn("[TM] 429 rate-limited. attempt=", attempt + 1);
      // If we have *any* cached value (even stale), use it instead of blanking UI
      if (hit?.data?.length) return hit.data;
      await sleep(350 * (attempt + 1));
      continue;
    }

    if (!res.ok) {
      console.error("[TM] Upstream not ok:", res.status, res.statusText, text.slice(0, 200));
      // fallback to cached if available
      if (hit?.data?.length) return hit.data;
      return [];
    }

    if (!ct.includes("application/json")) {
      console.error("[TM] Non-JSON response:", ct, text.slice(0, 200));
      if (hit?.data?.length) return hit.data;
      return [];
    }

    const json = JSON.parse(text);
    const raw = json?._embedded?.events;
    const rawEvents = Array.isArray(raw) ? raw : [];

    // cache the RAW events (not transformed) so routes can filter/match as needed
    CACHE.set(url, { at: now(), data: rawEvents, ttlMs });

    return rawEvents;
  }

  // If we exhausted retries, fallback to cache or empty
  if (hit?.data?.length) return hit.data;
  return [];
}