import { NextResponse } from "next/server";

const JAMBASE_BASE = "https://www.jambase.com/jb-api/v1";
const KEY_PARAM = "apikey";

export async function GET(req: Request) {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing JAMBASE_API_KEY" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const artistId = searchParams.get("artistId");
  if (!artistId) return NextResponse.json({ error: "Missing artistId" }, { status: 400 });

  // NOTE: JamBase may paginate — this grabs the first page.
  const url =
    `${JAMBASE_BASE}/events` +
    `?${KEY_PARAM}=${encodeURIComponent(apiKey)}` +
    `&artistId=${encodeURIComponent(artistId)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json(
    { artistId, count: json?.events?.length ?? 0, events: json?.events ?? [], pagination: json?.pagination ?? null },
    { status: res.ok ? 200 : res.status }
  );
}