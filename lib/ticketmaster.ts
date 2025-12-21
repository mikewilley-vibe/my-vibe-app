// lib/ticketmaster.ts
import type { Concert } from "@/lib/concerts/types";
const TM_BASE = "https://app.ticketmaster.com/discovery/v2/events.json";
const DEBUG = true;

export type FetchTMArgs = {
  // location-based search (optional)
  latlong?: string;
  radius?: string;
  unit?: "miles" | "km";

  // keyword-based search (optional)
  keyword?: string;

  // shared
  sort?: string;
  startDateTime?: string;
  endDateTime?: string;
  size?: string;
};


function pickImage(images: any[] | undefined): string | undefined {
  if (!Array.isArray(images) || images.length === 0) return undefined;

  // try to pick something wide-ish and not tiny
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
      (ev?.dates?.start?.localDate ? `${ev.dates.start.localDate}T20:00:00` : new Date().toISOString()),
    venue: String(venue?.name ?? "Venue TBA"),
    city: String(venue?.city?.name ?? ""),
    state: venue?.state?.stateCode ? String(venue.state.stateCode) : undefined,
    url: String(ev?.url ?? ""),
    image: pickImage(ev?.images),
    priceMin: typeof price?.min === "number" ? price.min : undefined,
    priceMax: typeof price?.max === "number" ? price.max : undefined,
  };
}

export function normalizeTMResponse(json: any): Concert[] {
  const events = json?._embedded?.events ?? [];
  return events.map(normalizeTMEvent).filter((e: Concert) => !!e.id && !!e.url);
}
export async function fetchTMEvents(args: FetchTMArgs) {
  const key = process.env.TICKETMASTER_API_KEY;

  if (!key) {
    console.error("Missing TICKETMASTER_API_KEY in server env");
    return [];
  }

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
  const text = await res.text();

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Ticketmaster returned non-JSON:", text.slice(0, 300));
    return [];
  }

  if (DEBUG) {
    console.log("TM status:", res.status);
    console.log("TM page:", json?.page);
    console.log("TM errors:", json?.errors ?? json?.fault ?? null);
    console.log("TM embedded keys:", Object.keys(json?._embedded ?? {}));
    // Don’t log requestUrl (it includes your apikey)
  }

  if (!res.ok) {
    console.error("Ticketmaster non-OK:", res.status, json?.errors ?? json?.fault ?? json);
    return [];
  }

  return normalizeTMResponse(json);
}