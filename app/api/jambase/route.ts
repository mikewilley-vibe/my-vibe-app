import { NextResponse } from "next/server";
import { myJamBaseArtistIds } from "@/app/data/myArtists";

const JAMBASE_BASE = "https://www.jambase.com/jb-api/v1";
const KEY_PARAM = "apikey"; // keep this if your working calls use it

export async function GET(req: Request) {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing JAMBASE_API_KEY" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);

  // ✅ If URL has ?artist=... use those; otherwise default to your personal list
  const artistIds =
    searchParams.getAll("artist").filter(Boolean).length > 0
      ? searchParams.getAll("artist").filter(Boolean)
      : myJamBaseArtistIds;

  const zip = searchParams.get("zip") ?? "23505";
  const radius = searchParams.get("radius") ?? "50";

  // If still empty, tell yourself what to do
  if (artistIds.length === 0) {
    return NextResponse.json(
      { error: "No artists configured. Add IDs in app/data/myArtists.ts" },
      { status: 400 }
    );
  }

  try {
    const results = await Promise.all(
      artistIds.map(async (artistId) => {
        const url =
          `${JAMBASE_BASE}/events` +
          `?${KEY_PARAM}=${encodeURIComponent(apiKey)}` +
          `&artistId=${encodeURIComponent(artistId)}` +
          `&zipCode=${encodeURIComponent(zip)}` +
          `&radius=${encodeURIComponent(radius)}`;

        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();

        return { artistId, ok: res.ok, status: res.status, data: json };
      })
    );

    const allEvents = results.flatMap((r) => r.data?.events ?? []);

    const deduped = Array.from(
      new Map(allEvents.map((e: any) => [e.id ?? e.url ?? JSON.stringify(e), e])).values()
    );

    deduped.sort((a: any, b: any) => {
      const ad = new Date(a.date ?? a.startDate ?? a.startsAt ?? 0).getTime();
      const bd = new Date(b.date ?? b.startDate ?? b.startsAt ?? 0).getTime();
      return ad - bd;
    });

    return NextResponse.json({
      artists: artistIds,
      zip,
      radius,
      count: deduped.length,
      events: deduped,
      debug: results.map((r) => ({
        artistId: r.artistId,
        ok: r.ok,
        status: r.status,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "JamBase fetch failed", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}