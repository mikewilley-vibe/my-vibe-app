// lib/ticketmaster.ts
import type { Concert } from "@/lib/concerts/types";

type TMParams = Record<string, string | undefined>;

function toQuery(params: TMParams) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v);
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

export async function fetchTMEvents(params: TMParams): Promise<Concert[]> {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    if (!apiKey) {
      console.error("[TM] Missing TICKETMASTER_API_KEY");
      return [];
    }

    const url =
      `https://app.ticketmaster.com/discovery/v2/events.json?` +
      toQuery({ ...params, apikey: apiKey });

    const res = await fetch(url, { cache: "no-store" });

    const ct = res.headers.get("content-type") || "";
    const text = await res.text(); // read once

    if (!res.ok) {
      console.error("[TM] Upstream not ok:", res.status, res.statusText, text.slice(0, 200));
      return [];
    }

    if (!ct.includes("application/json")) {
      console.error("[TM] Non-JSON response:", ct, text.slice(0, 200));
      return [];
    }

    const json = JSON.parse(text);
    const raw = json?._embedded?.events;
    const rawEvents = Array.isArray(raw) ? raw : [];

    return rawEvents.map(tmToConcert).filter(Boolean) as Concert[];
  } catch (err) {
    console.error("[TM] Exception:", err);
    return [];
  }
}