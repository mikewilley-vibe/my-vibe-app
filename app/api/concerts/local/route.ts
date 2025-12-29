// app/api/concerts/local/route.ts
import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import type { Concert } from "@/lib/concerts/types";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const lat = url.searchParams.get("lat") ?? "37.5407";
  const lon = url.searchParams.get("lon") ?? "-77.4360";
  const radius = url.searchParams.get("radius") ?? "120";

  const daysRaw = Number(url.searchParams.get("days") ?? "30");
  const days = clamp(Number.isFinite(daysRaw) ? daysRaw : 30, 1, 365);

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  // Keep size sane (more days => more events)
  const size = String(clamp(days * 6, 40, 200));

  try {
    const events: Concert[] = await fetchTMEvents({
      classificationName: "music", // keeps out sports/plays most of the time
      latlong: `${lat},${lon}`,
      radius,
      unit: "miles",
      sort: "date,asc",
      startDateTime: tmIso(start),
      endDateTime: tmIso(end),
      size,
    });

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      days,
      radius,
      events,
    });
  } catch (err: any) {
    console.error("[TM] local route failed:", err?.message ?? err);
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      days,
      radius,
      events: [],
      error: "Ticketmaster temporarily unavailable",
    });
  }
}