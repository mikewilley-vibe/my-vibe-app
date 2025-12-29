// app/api/concerts/music/route.ts
import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import type { Concert } from "@/lib/concerts/types";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tmToConcert(ev: any): Concert | null {
  const id = ev?.id;
  const name = ev?.name;
  const url = ev?.url;

  const dateTime = ev?.dates?.start?.dateTime || ev?.dates?.start?.localDate || "";
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

export async function GET(req: Request) {
  const u = new URL(req.url);

  const daysRaw = Number(u.searchParams.get("days") ?? "90");
  const days = clamp(Number.isFinite(daysRaw) ? daysRaw : 90, 1, 365);

  const lat = u.searchParams.get("lat") ?? "37.5407";
  const lon = u.searchParams.get("lon") ?? "-77.4360";
  const radius = u.searchParams.get("radius") ?? "120";

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  // Keep size sane
  const size = String(clamp(days * 6, 40, 200));

  try {
    const rawEvents = await fetchTMEvents({
      // IMPORTANT: this is what stops games/plays most of the time
      classificationName: "music",

      latlong: `${lat},${lon}`,
      radius,
      unit: "miles",
      sort: "date,asc",
      startDateTime: tmIso(start),
      endDateTime: tmIso(end),
      size,
    });

    const events: Concert[] = (Array.isArray(rawEvents) ? rawEvents : [])
      .map(tmToConcert)
      .filter(Boolean) as Concert[];

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      days,
      events,
    });
  } catch (err: any) {
    console.error("[TM] music route failed:", err?.message ?? err);
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      days,
      events: [],
      error: "Ticketmaster temporarily unavailable",
    });
  }
}