import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";

function tmIso(d: Date) {
  // Ticketmaster wants UTC with seconds + Z
  return d.toISOString().split(".")[0] + "Z";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat") ?? "37.5407";
  const lon = url.searchParams.get("lon") ?? "-77.4360";
  const radius = url.searchParams.get("radius") ?? "100";

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);

  try {
    const events = await fetchTMEvents({
      latlong: `${lat},${lon}`,
      radius,
      unit: "miles",
      sort: "date,asc",
      startDateTime: tmIso(start),
      endDateTime: tmIso(end),
      size: "24",
    });

    console.log("[TM] got events:", Array.isArray(events) ? events.length : events);

    // Always return a valid shape
    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      events: Array.isArray(events) ? events : [],
    });
  } catch (err: any) {
    // Never throw from an API route in prod
    console.error("[TM] next-7-days failed:", err?.message ?? err);

    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      events: [],
      error: "Ticketmaster temporarily unavailable",
    });
  }
}