import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.JAMBASE_API_KEY;

  const url = `https://www.jambase.com/jb-api/v1/events?apikey=${apiKey}&location=Richmond,VA`;

  const resp = await fetch(url);
  const data = await resp.json();

  return NextResponse.json(data);
}