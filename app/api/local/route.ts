import { NextResponse } from "next/server";
import { fetchTMEvents, tmToConcert } from "@/lib/ticketmaster";
import type { Concert } from "@/lib/concerts/types";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

function norm(s: any) {
  return String(s ?? "").toLowerCase().trim();
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const venue = url.searchParams.get("venue") ?? "";
  const lat = url.searchParams.get("lat") ?? "37.5407";
  const lon = url.searchParams.get("lon") ?? "-77.4360";
  const radius = url.searchParams.get("radius") ?? "100";
  const days = Number(url.searchParams.get("days") ?? "30");

  if (!venue.trim()) {
    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      events: [],
    });
  }

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + Math.min(Math.max(days, 1), 90));

  try {
    const raw = await fetchTMEvents({
      latlong: `${lat},${lon}`,
      radius,
      unit: "miles",
      sort: "date,asc",
      startDateTime: tmIso(start),
      endDateTime: tmIso(end),
      size: "80",
    });

    const venueNeedle = norm(venue);

    const events: Concert[] = (Array.isArray(raw) ? raw : [])
      .map(tmToConcert)
      .filter(Boolean)
      .filter((c: any) => norm(c?.venue).includes(venueNeedle)) as Concert[];

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      events,
      debug: { venue, days, totalPulled: Array.isArray(raw) ? raw.length : 0 },
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      events: [],
      error: "Ticketmaster temporarily unavailable",
    });
  }
}