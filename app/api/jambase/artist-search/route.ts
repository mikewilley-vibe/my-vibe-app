// app/api/jambase/artist-search/route.ts
import { NextResponse } from "next/server";

const JAMBASE_BASE = "https://www.jambase.com/jb-api/v1";

export async function GET(req: Request) {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing JAMBASE_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing ?q=" }, { status: 400 });
  }

  // JamBase supports searching artists by name
  const url =
    `${JAMBASE_BASE}/artists` +
    `?apikey=${encodeURIComponent(apiKey)}` +
    `&artistName=${encodeURIComponent(q)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json(
    { ok: res.ok, status: res.status, url, raw: json },
    { status: res.ok ? 200 : res.status }
  );
}