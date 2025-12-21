// app/api/concerts/following/route.ts
import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import { myArtists } from "@/app/data/myArtists";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

// tiny concurrency helper (no deps)
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
  end.setDate(end.getDate() + 180); // farther out for “following”

  // Richmond-ish default (tweak as you like)
  const latlong = "37.5407,-77.4360";
  const radius = "200";

  // ✅ keep this low (2–3) to avoid TM 429
  const CONCURRENCY = 2;

  // ✅ keep this low too
  const PER_ARTIST_SIZE = "6";

  const groups = await mapLimit(myArtists, CONCURRENCY, async (artist, idx) => {
    const keyword = (artist as any).tmQuery ?? (artist as any).name ?? String(artist);

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

    return { artist: (artist as any).name ?? String(artist), events };
  });

  // remove empty artists
  const results = groups.filter((g) => Array.isArray(g.events) && g.events.length > 0);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    results,
  });
}