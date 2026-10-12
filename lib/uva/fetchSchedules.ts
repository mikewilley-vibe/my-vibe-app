import { espnScheduleUrl, parseEspnSchedule, type UvaFeedGame } from "@/lib/uva/espnGames";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { accept: "application/json", "user-agent": USER_AGENT },
  });
  if (!response.ok) throw new Error(`ESPN HTTP ${response.status} for ${url}`);
  return response.json();
}

async function loadSeason(
  sport: UvaFeedGame["sport"],
  season: number,
  teamId: string,
): Promise<UvaFeedGame[]> {
  const urls = [espnScheduleUrl(sport, season, 2, teamId), espnScheduleUrl(sport, season, 3, teamId)];
  const results = await Promise.allSettled(urls.map((url) => fetchJson(url)));
  const games = results.flatMap((result) =>
    result.status === "fulfilled" ? parseEspnSchedule(result.value, { sport, season, teamId }) : [],
  );
  if (!games.length) {
    const reason = results.find((result) => result.status === "rejected");
    throw new Error(reason?.status === "rejected" ? String(reason.reason) : `ESPN returned no ${sport} games for ${season}`);
  }
  const byId = new Map<string, UvaFeedGame>();
  for (const game of games) byId.set(game.id, game);
  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export async function fetchFootballGames(season: number, teamId = process.env.UVA_NCAAF_TEAM_ID ?? "258") {
  const games = await loadSeason("football", season, teamId);
  return { games, source: `espn:college-football:${teamId}:${season}` };
}

export async function fetchBasketballGames(season: number, teamId = process.env.UVA_NCAAM_TEAM_ID ?? "258") {
  const current = await loadSeason("basketball", season, teamId);
  const finals = current.filter((game) => game.status === "final");
  let games = current;
  if (finals.length < 5) {
    try {
      const previous = await loadSeason("basketball", season - 1, teamId);
      const recent = previous.filter((game) => game.status === "final").slice(-8);
      const byId = new Map<string, UvaFeedGame>();
      for (const game of [...recent, ...current]) byId.set(game.id, game);
      games = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    } catch {
      games = current;
    }
  }
  return { games, source: `espn:mens-college-basketball:${teamId}:${season}` };
}
