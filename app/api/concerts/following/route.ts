import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import { myArtists } from "@/app/data/myArtists";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length) as any;
  let i = 0;

  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function GET() {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 180);

  const latlong = "37.5407,-77.4360";
  const radius = "200";
  const CONCURRENCY = 2;
  const PER_ARTIST_SIZE = "6";

  try {
    const groups = await mapLimit(myArtists, CONCURRENCY, async (artist) => {
      const keyword = artist.tmQuery ?? artist.name;

      const events = await fetchTMEvents({
        keyword,
        latlong,
        radius,
        unit: "miles",
        sort: "date,asc",
        startDateTime: tmIso(start),
        endDateTime: tmIso(end),
        size: PER_ARTIST_SIZE,
      });

      return { artist: artist.name, events };
    });

    const results = groups.filter((g) => g.events.length > 0);

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      results, // ✅ always an array
    });
  } catch (err: any) {
    console.error("[TM] following failed:", err?.message ?? err);
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      results: [], // ✅ array, not {}
      error: "Ticketmaster temporarily unavailable",
    });
  }
}