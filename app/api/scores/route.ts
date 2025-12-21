// app/api/scores/route.ts
import { NextResponse } from "next/server";

const DEBUG = false;

export type ScoreStatus = "scheduled" | "live" | "final";

export type ScoreGame = {
  id: string;
  league: "NFL" | "NCAAF" | "NCAAM";
  name: string;
  home: string;
  away: string;
  homeLogo?: string;
  awayLogo?: string;
  gamecastUrl?: string;
  startTime: string;
  status: ScoreStatus;
  homeScore?: number;
  awayScore?: number;
  detail?: string;
  hasRankedTeam?: boolean;
  isACCGame?: boolean;
};

const UVA_NCAAM_TEAM_ID = "258"; // Virginia Cavaliers (men's basketball) on ESPN
const UVA_NCAAF_TEAM_ID = "258"; // Virginia Cavaliers (college football) on ESPN

const ENDPOINTS: Record<ScoreGame["league"], string> = {
  NFL: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  NCAAF:
    "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
  NCAAM:
    "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard",
};

function getNextSunday(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = (7 - day) % 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function getTodayYmd() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

function toNum(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function getRank(team: any): number | null {
  const r =
    team?.rank ||
    team?.rankings?.[0]?.rank ||
    team?.curatedRank?.current;
  const n = Number(r);
  return Number.isFinite(n) ? n : null;
}
function yyyymmdd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function parseDateParam(searchParams: URLSearchParams): string | null {
  // Accept "YYYYMMDD" or "YYYY-MM-DD"
  const raw = searchParams.get("date");
  if (!raw) return null;

  const compact = raw.replaceAll("-", "");
  if (/^\d{8}$/.test(compact)) return compact;

  return null;
}

function withDate(endpoint: string, ymd: string | null) {
  if (!ymd) return endpoint;
  const u = new URL(endpoint);
  u.searchParams.set("dates", ymd); // ESPN scoreboard param
  return u.toString();
}
function isACC(team: any): boolean {
  return team?.conference?.abbreviation === "ACC";
}

function statusFromState(state: string | undefined): ScoreStatus {
  const s = (state ?? "").toLowerCase();
  if (s === "in" || s === "live") return "live";
  if (s === "post" || s === "final") return "final";
  return "scheduled";
}

function safeTeamName(team: any) {
  // prefer shortDisplayName; fall back to displayName/name
  return (
    team?.shortDisplayName ||
    team?.displayName ||
    team?.name ||
    team?.abbreviation ||
    "TBD"
  );}
 function firstFutureEvent(events: any[]): any | null {
  const now = Date.now();
  const future = (events ?? [])
    .map((ev) => ({ ev, t: new Date(ev?.date ?? "").getTime() }))
    .filter((x) => Number.isFinite(x.t) && x.t > now)
    .sort((a, b) => a.t - b.t);
  return future[0]?.ev ?? null;
}

function pickGamecastUrl(ev: any, fallbackGameId: string) {
  const links: any[] = ev?.links ?? ev?.competitions?.[0]?.links ?? [];
  const gamecast =
    links.find((l) => (l?.rel ?? []).includes("gamecast")) ||
    links.find((l) => (l?.rel ?? []).includes("summary")) ||
    links.find((l) => (l?.rel ?? []).includes("desktop")) ||
    null;

  return (
    gamecast?.href ||
    `https://www.espn.com/game/_/gameId/${fallbackGameId}` // fallback
  );
}

async function fetchNextTeamGames(
  league: ScoreGame["league"],
  sportPath: string,
  teamId: string,
  count: number
): Promise<ScoreGame[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/schedule`;
  const res = await fetch(url, { next: { revalidate: 60 * 30 } }); // 30 min cache
  if (!res.ok) return [];

  const json = await res.json();

  // Schedule payload varies; collect events from common shapes
  const events: any[] =
    json?.events ??
    json?.schedule?.[0]?.events ??
    json?.team?.nextEvent ??
    [];

  const now = Date.now();

  const future = events
    .map((ev) => {
      const comp = ev?.competitions?.[0] ?? ev?.competitions ?? ev;
      const startTime =
        (ev?.date as string | undefined) ||
        (comp?.date as string | undefined) ||
        undefined;

      const t = startTime ? new Date(startTime).getTime() : NaN;
      return { ev, startTime: startTime ?? new Date().toISOString(), t };
    })
    .filter((x) => Number.isFinite(x.t) && x.t >= now)
    .sort((a, b) => a.t - b.t)
    .slice(0, count);

  return future.map(({ ev, startTime }) => {
    const comp = ev?.competitions?.[0] ?? ev?.competitions ?? ev;
    const competitors: any[] = comp?.competitors ?? [];
    const homeObj = competitors.find((c) => c?.homeAway === "home") ?? competitors[0];
    const awayObj = competitors.find((c) => c?.homeAway === "away") ?? competitors[1];

    const homeTeam = homeObj?.team;
    const awayTeam = awayObj?.team;

    const home = safeTeamName(homeTeam);
    const away = safeTeamName(awayTeam);

    const detail =
      (comp?.status?.type?.detail as string | undefined) ||
      (ev?.status?.type?.detail as string | undefined) ||
      "Upcoming";

    // Build a gamecast URL (keeps your “click → ESPN gamecast” behavior)
    const gamecastUrl =
      league === "NFL"
        ? `https://www.espn.com/nfl/game/_/gameId/${ev?.id}`
        : league === "NCAAF"
        ? `https://www.espn.com/college-football/game/_/gameId/${ev?.id}`
        : `https://www.espn.com/mens-college-basketball/game/_/gameId/${ev?.id}`;

    return {
      id: String(ev?.id ?? `${league}-uva-${away}@${home}-${startTime}`),
      league,
      name: `${away} @ ${home}`,
      home,
      away,
      startTime,
      status: "scheduled",
      detail: `UVA next • ${detail}`,
      homeLogo: homeTeam?.logos?.[0]?.href || homeTeam?.logo || undefined,
      awayLogo: awayTeam?.logos?.[0]?.href || awayTeam?.logo || undefined,
      gamecastUrl,
      hasRankedTeam: getRank(homeTeam) !== null || getRank(awayTeam) !== null,
      isACCGame: isACC(homeTeam) || isACC(awayTeam),
    } satisfies ScoreGame;
  });
}

function parseESPN(league: ScoreGame["league"], json: any): ScoreGame[] {
  const events: any[] = json?.events ?? [];
  return events.map((ev) => {
    const comp = ev?.competitions?.[0];
    const comps: any[] = comp?.competitors ?? [];

    // ESPN usually provides "home"/"away"
    const homeObj = comps.find((c) => c?.homeAway === "home") ?? comps[0];
    const awayObj = comps.find((c) => c?.homeAway === "away") ?? comps[1];

    const homeTeam = homeObj?.team;
    const awayTeam = awayObj?.team;

    const home = safeTeamName(homeTeam);
    const away = safeTeamName(awayTeam);

    const state = comp?.status?.type?.state as string | undefined;
    const status = statusFromState(state);

    const homeScore = toNum(homeObj?.score);
    const awayScore = toNum(awayObj?.score);

const homeRank = getRank(homeTeam);
const awayRank = getRank(awayTeam);

const hasRankedTeam = homeRank !== null || awayRank !== null;
const isACCGame = isACC(homeTeam) || isACC(awayTeam);

    const detail =
      (comp?.status?.type?.detail as string | undefined) ||
      (ev?.status?.type?.detail as string | undefined) ||
      undefined;

    const startTime =
      (ev?.date as string | undefined) ||
      (comp?.date as string | undefined) ||
      new Date().toISOString();

    const name =
      (ev?.shortName as string | undefined) ||
      `${away} @ ${home}`;

const homeLogo =
  homeTeam?.logos?.[0]?.href || homeTeam?.logo || undefined;

const awayLogo =
  awayTeam?.logos?.[0]?.href || awayTeam?.logo || undefined;

const gamecastUrl =
  league === "NFL"
    ? `https://www.espn.com/nfl/game/_/gameId/${ev?.id}`
    : league === "NCAAF"
    ? `https://www.espn.com/college-football/game/_/gameId/${ev?.id}`
    : `https://www.espn.com/mens-college-basketball/game/_/gameId/${ev?.id}`;

    return {
  id: String(ev?.id ?? `${league}-${name}-${startTime}`),
  league,
  name,
  home,
  away,
  homeLogo,
  awayLogo,
  gamecastUrl,
  startTime,
  status,
  homeScore,
  awayScore,
  detail,
   // NEW
  hasRankedTeam,
  isACCGame,
};
  });
}

function getNextSundayYmd() {
  const d = new Date();
  const day = d.getDay(); // 0=Sun,1=Mon,...

  // days until next Sunday (NEVER 0)
  const diff = day === 0 ? 7 : 7 - day;

  d.setDate(d.getDate() + diff);

  // build YYYYMMDD in LOCAL time (no UTC shift)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${dd}`;
}

function withinHours(msDiff: number, hours: number) {
  return msDiff <= hours * 60 * 60 * 1000;
}

function filterWindow(games: ScoreGame[], preset: string) {
  if (preset === "nfl") return games.filter((g) => g.league === "NFL");

  if (preset === "ncaa") {
    return games.filter((g) => g.league === "NCAAM" || g.league === "NCAAF");
  }

  // ...existing “live” window logic...
  const now = Date.now();

  const UPCOMING_HOURS = 36;
  const RECENT_FINAL_HOURS = 18;
  const RECENT_PAST_HOURS = 6;

  return games.filter((g) => {
    const t = Date.parse(g.startTime);
    if (!Number.isFinite(t)) return true;

    const diff = t - now;

    if (g.status === "live") return true;

    if (g.status === "scheduled") {
      if (diff >= 0 && withinHours(diff, UPCOMING_HOURS)) return true;
      if (diff < 0 && withinHours(Math.abs(diff), RECENT_PAST_HOURS)) return true;
      return false;
    }

    if (g.status === "final") {
      return diff < 0 && withinHours(Math.abs(diff), RECENT_FINAL_HOURS);
    }

    return true;
  });
}

function sortTop(games: ScoreGame[]) {
  const statusRank = (s: ScoreStatus) =>
    s === "live" ? 0 : s === "scheduled" ? 1 : 2;

  return games.sort((a, b) => {
    // 1️⃣ Live > Scheduled > Final
    const sr = statusRank(a.status) - statusRank(b.status);
    if (sr !== 0) return sr;

    // 2️⃣ For college sports only: ranked teams first
    if (a.league !== "NFL" && b.league !== "NFL") {
      if (a.hasRankedTeam !== b.hasRankedTeam) {
        return a.hasRankedTeam ? -1 : 1;
      }

      // 3️⃣ Then ACC games
      if (a.isACCGame !== b.isACCGame) {
        return a.isACCGame ? -1 : 1;
      }
    }

    // 4️⃣ Soonest start time
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
}

async function fetchNextTeamGame(
  league: ScoreGame["league"],
  sportPath: string,
  teamId: string
): Promise<ScoreGame | null> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/schedule`;

  const res = await fetch(url, { next: { revalidate: 60 * 30 } }); // 30 min cache
  if (!res.ok) return null;

  const json = await res.json();

  // ESPN schedule shape can vary; this works for the common one
  const events: any[] =
    json?.events ??
    json?.schedule?.[0]?.events ??
    json?.team?.nextEvent ??
    [];

  const now = Date.now();

  const future = events
    .map((ev) => {
      const comp = ev?.competitions?.[0] ?? ev?.competitions ?? ev;
      const startTime =
        (ev?.date as string | undefined) ||
        (comp?.date as string | undefined) ||
        undefined;

      const t = startTime ? new Date(startTime).getTime() : NaN;
      return { ev, startTime: startTime ?? new Date().toISOString(), t };
    })
    .filter((x) => Number.isFinite(x.t) && x.t >= now)
    .sort((a, b) => a.t - b.t)[0];

  if (!future) return null;

  // opponent/team names
  const comp = future.ev?.competitions?.[0] ?? future.ev?.competitions ?? future.ev;
  const competitors: any[] = comp?.competitors ?? [];
  const homeObj = competitors.find((c) => c?.homeAway === "home") ?? competitors[0];
  const awayObj = competitors.find((c) => c?.homeAway === "away") ?? competitors[1];

  const home = safeTeamName(homeObj?.team);
  const away = safeTeamName(awayObj?.team);

  const detail =
    (comp?.status?.type?.detail as string | undefined) ||
    (future.ev?.status?.type?.detail as string | undefined) ||
    "Upcoming";

  return {
    id: String(future.ev?.id ?? `${league}-uva-next-${future.startTime}`),
    league,
    name: `${away} @ ${home}`,
    home,
    away,
    startTime: future.startTime,
    status: "scheduled",
    detail: `UVA next • ${detail}`,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const preset = url.searchParams.get("preset") ?? "live";
    const dateParam = parseDateParam(url.searchParams);

const ymd =
  preset === "nfl"
    ? getNextSundayYmd()     // NFL Sunday slate
    : preset === "ncaa"
    ? getTodayYmd()          // NCAA Hoops slate (today)
    : (dateParam ?? null);   // Live / manual date

  const leagues: ScoreGame["league"][] =
  preset === "nfl" ? ["NFL"] :
  preset === "ncaa" ? ["NCAAM", "NCAAF"] :
  ["NFL", "NCAAF", "NCAAM"];

    const results = await Promise.all(
      leagues.map(async (lg) => {
        const endpoint = withDate(ENDPOINTS[lg], ymd);
        const res = await fetch(endpoint, { next: { revalidate: 30 } });
        if (!res.ok) return [] as ScoreGame[];
        const json = await res.json();
        return parseESPN(lg, json);
      })
    );

    // existing scoreboard games
    const scoreboardGames = results.flat();

    // UVA pinned games (2 each)
    const [uvaMbb, uvaFb] = await Promise.all([
      fetchNextTeamGames("NCAAM", "basketball/mens-college-basketball", UVA_NCAAM_TEAM_ID, 2),
      fetchNextTeamGames("NCAAF", "football/college-football", UVA_NCAAF_TEAM_ID, 2),
    ]);

    const pinned: ScoreGame[] = [...uvaMbb, ...uvaFb];

    // merge + dedupe (pinned first)
    const mergedAll: ScoreGame[] = [...pinned, ...scoreboardGames];
    const deduped: ScoreGame[] = Array.from(
      new Map(mergedAll.map((g) => [g.id, g])).values()
    );

  // ✅ apply windowing based on preset (NFL bypass happens inside filterWindow)
const windowed = filterWindow(deduped, preset);

// final ordering + limit
const merged = sortTop(windowed).slice(0, 12);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      games: merged,
    });
  } catch {
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), games: [] },
      { status: 200 }
    );
  }
}