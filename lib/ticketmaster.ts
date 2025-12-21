// lib/ticketmaster.ts
import type { Concert } from "@/lib/concerts/types";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2/events.json";

// Keep logs/dev noise down in Vercel builds
const DEBUG = process.env.NODE_ENV === "development";

export type FetchTMArgs = {
  // location-based search (optional)
  latlong?: string;
  radius?: string;
  unit?: "miles" | "km";

  // keyword-based search (optional)
  keyword?: string;

  // shared
  sort?: string; // e.g. "date,asc"
  startDateTime?: string; // e.g. "2025-12-19T19:05:36Z"
  endDateTime?: string;
  size?: string;
};

// ---------- Normalization ----------
function pickImage(images: any[] | undefined): string | undefined {
  if (!Array.isArray(images) || images.length === 0) return undefined;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted.find((img) => (img.width ?? 0) >= 800)?.url ?? sorted[0]?.url;
}

export function normalizeTMEvent(ev: any): Concert {
  const venue = ev?._embedded?.venues?.[0];
  const price = ev?.priceRanges?.[0];

  return {
    id: String(ev?.id ?? ""),
    name: String(ev?.name ?? "Untitled show"),
    dateTime:
      ev?.dates?.start?.dateTime ||
      (ev?.dates?.start?.localDate
        ? `${ev.dates.start.localDate}T20:00:00`
        : new Date().toISOString()),
    venue: String(venue?.name ?? "Venue TBA"),
    city: String(venue?.city?.name ?? ""),
    state: venue?.state?.stateCode ? String(venue.state.stateCode) : undefined,
    url: String(ev?.url ?? ""),
    image: pickImage(ev?.images),
    priceMin: typeof price?.min === "number" ? price.min : undefined,
    priceMax: typeof price?.max === "number" ? price.max : undefined,
  };
}

function normalizeTMResponse(json: any): Concert[] {
  const events = json?._embedded?.events ?? [];
  return (events as any[])
    .map(normalizeTMEvent)
    .filter((e) => !!e.id && !!e.url);
}

// ---------- Small cache + in-flight de-dupe ----------
type CacheEntry = { at: number; data: Concert[] };
const CACHE_TTL_MS = 30_000; // 30s (enough to prevent “burst” 429s)
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<Concert[]>>();

function stableKey(args: FetchTMArgs) {
  // Build a stable cache key WITHOUT apikey
  const o: Record<string, string> = {};
  if (args.latlong) o.latlong = args.latlong;
  if (args.radius) o.radius = args.radius;
  if (args.unit) o.unit = args.unit;
  if (args.keyword) o.keyword = args.keyword;
  if (args.sort) o.sort = args.sort;
  if (args.startDateTime) o.startDateTime = args.startDateTime;
  if (args.endDateTime) o.endDateTime = args.endDateTime;
  if (args.size) o.size = args.size;

  // stable stringify
  return Object.keys(o)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(o[k])}`)
    .join("&");
}

function getCached(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) return null;
  return hit.data;
}

function setCached(key: string, data: Concert[]) {
  cache.set(key, { at: Date.now(), data });
}

// Optional: tiny “spacing” between TM calls to reduce spike arrest
let lastCallAt = 0;
async function spaceCalls(minGapMs = 220) {
  const now = Date.now();
  const wait = lastCallAt + minGapMs - now;
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
}

// ---------- Public fetch ----------
export async function fetchTMEvents(args: FetchTMArgs): Promise<Concert[]> {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key) {
    if (DEBUG) console.warn("[TM] Missing TICKETMASTER_API_KEY");
    return [];
  }

  const cacheKey = stableKey(args);

  // 1) serve warm cache
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // 2) de-dupe identical in-flight calls
  const existing = inflight.get(cacheKey);
  if (existing) return existing;

  const run = (async () => {
    try {
      await spaceCalls(); // reduce TM spike arrest

      const params = new URLSearchParams({
        apikey: key,
        countryCode: "US",
        classificationName: "music",
        size: args.size ?? "20",
        sort: args.sort ?? "date,asc",
      });

      if (args.latlong) params.set("latlong", args.latlong);
      if (args.radius) params.set("radius", args.radius);
      if (args.unit) params.set("unit", args.unit);

      if (args.keyword) params.set("keyword", args.keyword);
      if (args.startDateTime) params.set("startDateTime", args.startDateTime);
      if (args.endDateTime) params.set("endDateTime", args.endDateTime);

      const requestUrl = `${TM_BASE}?${params.toString()}`;

      const res = await fetch(requestUrl, { cache: "no-store" });

      // If rate-limited, return cache if we have anything older (even expired) as a fallback
      if (res.status === 429) {
        const anyHit = cache.get(cacheKey)?.data;
        if (DEBUG) console.warn("[TM] 429 rate-limited; returning cached:", !!anyHit);
        return anyHit ?? [];
      }

      const text = await res.text();
      let json: any = null;

      try {
        json = JSON.parse(text);
      } catch {
        if (DEBUG) console.error("[TM] Non-JSON response:", text.slice(0, 200));
        return [];
      }

      if (!res.ok) {
        if (DEBUG) {
          console.error("[TM] Non-OK:", res.status, json?.errors ?? json?.fault ?? json);
        }
        return [];
      }

      const concerts = normalizeTMResponse(json);

      if (DEBUG) {
        console.log("[TM] ok:", {
          page: json?.page,
          count: concerts.length,
          embeddedKeys: Object.keys(json?._embedded ?? {}),
        });
      }

      setCached(cacheKey, concerts);
      return concerts;
    } catch (e) {
      if (DEBUG) console.error("[TM] fetch failed:", e);
      return [];
    } finally {
      inflight.delete(cacheKey);
    }
  })();

  inflight.set(cacheKey, run);
  return run;
}