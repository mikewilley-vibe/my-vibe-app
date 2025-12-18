import { NextResponse } from "next/server";

const JAMBASE_BASE = "https://www.jambase.com/jb-api/v1";
const KEY_PARAM = "apikey";

export async function GET(req: Request) {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing JAMBASE_API_KEY" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip") ?? "23505";
  const radius = searchParams.get("radius") ?? "50";

  const url =
    `${JAMBASE_BASE}/events` +
    `?${KEY_PARAM}=${encodeURIComponent(apiKey)}` +
    `&zipCode=${encodeURIComponent(zip)}` +
    `&radius=${encodeURIComponent(radius)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json(
    { zip, radius, count: json?.events?.length ?? 0, events: json?.events ?? [] },
    { status: res.ok ? 200 : res.status }
  );
}