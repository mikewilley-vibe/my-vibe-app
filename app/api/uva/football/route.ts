import { NextResponse } from "next/server";
import { footballSeasonYear, type UvaFeedGame } from "@/lib/uva/espnGames";
import { fetchFootballGames } from "@/lib/uva/fetchSchedules";
import { getUvaFootballSchedule } from "@/lib/uvaFootballSchedule";
import { readUvaSnapshot, refreshUvaSchedules } from "@/lib/uva/refreshSchedules";

export const dynamic = "force-dynamic";

function livePayload(season: string, games: UvaFeedGame[], source: string, updatedAt: string, stale?: boolean) {
  return {
    ok: true,
    updatedAt,
    games,
    count: games.length,
    season,
    fallback: false,
    source,
    timeZone: "America/New_York",
    ...(stale ? { stale: true } : {}),
  };
}

export async function GET(req: Request) {
  const requested = new URL(req.url).searchParams.get("season");
  const current = String(footballSeasonYear());
  if (requested && requested !== current) {
    try {
      const live = await fetchFootballGames(Number(requested));
      return NextResponse.json(livePayload(requested, live.games, live.source, new Date().toISOString()));
    } catch {
      return NextResponse.json(await getUvaFootballSchedule(requested));
    }
  }

  const snapshot = await readUvaSnapshot();
  if (snapshot?.football.length) {
    return NextResponse.json(livePayload(
      String(snapshot.footballSeason),
      snapshot.football,
      snapshot.source,
      snapshot.updatedAt,
      snapshot.stale,
    ));
  }

  const refreshed = await refreshUvaSchedules();
  if (refreshed.snapshot?.football.length) {
    return NextResponse.json(livePayload(
      String(refreshed.snapshot.footballSeason),
      refreshed.snapshot.football,
      refreshed.snapshot.source,
      refreshed.snapshot.updatedAt,
      refreshed.snapshot.stale,
    ));
  }

  return NextResponse.json(await getUvaFootballSchedule(current));
}
