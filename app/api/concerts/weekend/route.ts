import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";

function tmIso(d: Date) {
  // Ticketmaster wants UTC with seconds + Z
  return d.toISOString().split(".")[0] + "Z"; // e.g. 2025-12-19T19:05:36Z
}

function nextFridayToSunday() {
  const now = new Date();
  const day = now.getDay(); // 0 Sun ... 5 Fri ... 6 Sat
  const addToFri = (5 - day + 7) % 7;
  const fri = new Date(now);
  fri.setDate(fri.getDate() + addToFri);
  fri.setHours(0, 0, 0, 0);

  const sun = new Date(fri);
  sun.setDate(sun.getDate() + 2);
  sun.setHours(23, 59, 59, 999);

  return { start: fri, end: sun };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat") ?? "37.5407";
  const lon = url.searchParams.get("lon") ?? "-77.4360";
  const radius = url.searchParams.get("radius") ?? "75";

  const { start, end } = nextFridayToSunday();

  const events = await fetchTMEvents({
    latlong: `${lat},${lon}`,
    radius,
    unit: "miles",
    sort: "date,asc",
    startDateTime: tmIso(start),
    endDateTime: tmIso(end),
    size: "24",
  });

  return NextResponse.json({ updatedAt: new Date().toISOString(), events });
}