// app/api/uva/football/route.ts
import { NextResponse } from "next/server";
import {
  currentFootballSeason,
  getUvaFootballSchedule,
} from "@/lib/uvaFootballSchedule";

export async function GET(req: Request) {
  const season =
    new URL(req.url).searchParams.get("season") ?? currentFootballSeason();
  const data = await getUvaFootballSchedule(season);
  return NextResponse.json(data);
}
