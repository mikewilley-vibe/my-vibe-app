import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import type { Concert } from "@/lib/concerts/types";
import { myArtists } from "@/app/data/myArtists";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickArtistName(a: any): string {
  if (typeof a === "string") return a.trim();
  return String(a?.name ?? a?.artist ?? a?.label ?? "").trim();
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const lat = url.searchParams.get("lat") ?? "37.5407";
  const lon = url.searchParams.get("lon") ?? "-77.4360";
  const radius = url.searchParams.get("radius") ?? "1000";
  const daysRaw = Number(url.searchParams.get("days") ?? "180");
  const days = clamp(Number.isFinite(daysRaw) ? daysRaw : 180, 1, 365);

  const artists = (Array.isArray(myArtists) ? myArtists : [])
    .map(pickArtistName)
    .filter(Boolean);

  if (artists.length === 0) {
    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      events: [],
      debug: { reason: "No myArtists configured" },
    });
  }

  try {
    // Query TM per-artist using keyword (reliable + avoids needing _embedded.attractions)
    const batches = await Promise.all(
      artists.map(async (artist) => {
        const concerts = await fetchTMEvents({
          classificationName: "music",
          keyword: artist,
          latlong: `${lat},${lon}`,
          radius,
          unit: "miles",
          sort: "date,asc",
          size: "80",
          days: String(days), // 👈 supported by your lib? If not, remove this line.
        } as any);

        return Array.isArray(concerts) ? concerts : [];
      })
    );

    const merged: Concert[] = batches.flat();

    // Dedup by id
    const deduped = Array.from(new Map(merged.map((c) => [c.id, c])).values());

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      events: deduped,
      debug: {
        artists: artists.length,
        pulled: merged.length,
        deduped: deduped.length,
        radius,
        days,
        sample: deduped[0] ?? null,
      },
    });
  } catch (err: any) {
    console.error("[TM] my-artists failed:", err?.message ?? err);
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      events: [],
      error: "Ticketmaster temporarily unavailable",
    });
  }
}