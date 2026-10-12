export const UVA_TIME_ZONE = "America/New_York";

export type UvaFeedLocation = "home" | "away" | "neutral";
export type UvaFeedStatus = "scheduled" | "in_progress" | "final" | "postponed" | "canceled";
export type UvaFeedResult = "win" | "loss" | "tie" | "pending";

export type UvaFeedGame = {
  id: string;
  sport: "football" | "basketball";
  opponent: string;
  date: string;
  location: UvaFeedLocation;
  result?: UvaFeedResult;
  /** UVA points first. Present only when the game is final. */
  score?: string;
  status: UvaFeedStatus;
  note?: string;
  sourceUrl?: string;
  venue?: string;
  network?: string;
  timeUnknown?: boolean;
  timeZone: typeof UVA_TIME_ZONE;
};

export type UvaScheduleSnapshot = {
  updatedAt: string;
  footballSeason: number;
  basketballSeason: number;
  football: UvaFeedGame[];
  basketball: UvaFeedGame[];
  source: string;
  stale?: boolean;
};

type EspnCompetitor = {
  homeAway?: string;
  winner?: boolean;
  score?: unknown;
  team?: { id?: string | number; displayName?: string; shortDisplayName?: string };
};

type EspnCompetition = {
  date?: string;
  neutralSite?: boolean;
  timeValid?: boolean;
  venue?: { fullName?: string };
  notes?: Array<{ headline?: string }>;
  broadcasts?: Array<{ media?: { shortName?: string } }>;
  competitors?: EspnCompetitor[];
  status?: { type?: { name?: string; state?: string; completed?: boolean; shortDetail?: string } };
};

type EspnEvent = {
  date?: string;
  name?: string;
  links?: Array<{ href?: string; rel?: string[] }>;
  competitions?: EspnCompetition[];
};

export function etSeasonParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: UVA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return { year, month };
}

/** Football season is the fall year. January–June still belong to the previous fall. */
export function footballSeasonYear(now = new Date()) {
  const { year, month } = etSeasonParts(now);
  return month < 7 ? year - 1 : year;
}

/** Men's basketball season is labeled by the year it ends. */
export function basketballSeasonYear(now = new Date()) {
  const { year, month } = etSeasonParts(now);
  return month >= 7 ? year + 1 : year;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "opponent";
}

function points(score: unknown): number | undefined {
  if (typeof score === "number" && Number.isFinite(score)) return Math.trunc(score);
  if (typeof score === "string" && /^\d{1,3}$/.test(score.trim())) return Number(score.trim());
  if (score && typeof score === "object") {
    const record = score as { displayValue?: unknown; value?: unknown };
    return points(record.displayValue ?? record.value);
  }
  return undefined;
}

function networkName(competition: EspnCompetition): string | undefined {
  const names = (competition.broadcasts ?? [])
    .map((broadcast) => broadcast.media?.shortName?.trim())
    .filter((name): name is string => Boolean(name));
  const name = names[0];
  if (!name) return undefined;
  if (name === "ACC Network") return "ACCN";
  if (name === "ACC Network Extra") return "ACCNX";
  return name;
}

export function gameStatus(competition: EspnCompetition): UvaFeedStatus {
  const type = competition.status?.type;
  const name = String(type?.name ?? "").toUpperCase();
  const detail = String(type?.shortDetail ?? "").toLowerCase();
  if (name.includes("CANCEL")) return "canceled";
  if (name.includes("POSTPON") || detail.includes("postpon")) return "postponed";
  if (type?.completed || name.includes("FINAL") || type?.state === "post") return "final";
  if (type?.state === "in" || name.includes("IN_PROGRESS") || name.includes("HALFTIME") || name.includes("DELAY")) {
    return "in_progress";
  }
  return "scheduled";
}

export function parseEspnSchedule(
  body: unknown,
  options: { sport: UvaFeedGame["sport"]; season: number; teamId?: string },
): UvaFeedGame[] {
  const teamId = String(options.teamId ?? "258");
  const events = (body as { events?: unknown } | null)?.events;
  if (!Array.isArray(events)) return [];
  const games: UvaFeedGame[] = [];

  for (const item of events) {
    const event = item as EspnEvent;
    const competition = event.competitions?.[0];
    if (!competition) continue;
    const competitors = competition.competitors ?? [];
    const me = competitors.find((competitor) => String(competitor.team?.id) === teamId);
    const opponentSide = competitors.find((competitor) => String(competitor.team?.id) !== teamId);
    const opponent = opponentSide?.team?.displayName?.trim() || opponentSide?.team?.shortDisplayName?.trim();
    const rawDate = event.date || competition.date;
    if (!me || !opponent || !rawDate || !Number.isFinite(Date.parse(rawDate))) continue;

    const status = gameStatus(competition);
    const homeAway = String(me.homeAway ?? "").toLowerCase();
    const location: UvaFeedLocation = competition.neutralSite
      ? "neutral"
      : homeAway === "home" || homeAway === "away"
        ? homeAway
        : "neutral";
    const uvaPoints = points(me.score);
    const opponentPoints = points(opponentSide?.score);
    const final = status === "final" && uvaPoints !== undefined && opponentPoints !== undefined;
    const result: UvaFeedResult | undefined = !final
      ? status === "scheduled" || status === "in_progress"
        ? "pending"
        : undefined
      : uvaPoints === opponentPoints
        ? "tie"
        : me.winner === true || uvaPoints > opponentPoints
          ? "win"
          : "loss";
    const venue = competition.venue?.fullName?.trim();
    const headline = competition.notes?.find((note) => note.headline?.trim())?.headline?.trim();
    const network = networkName(competition);
    const timeUnknown = competition.timeValid === false;
    const links = event.links ?? [];
    const sourceUrl = links.find((link) => link.rel?.includes("summary"))?.href || links.find((link) => link.href)?.href;
    const day = new Date(rawDate).toISOString().slice(0, 10);

    games.push({
      id: `uva-${options.sport === "football" ? "fb" : "mbb"}-${options.season}-${slug(opponent)}-${day}`,
      sport: options.sport,
      opponent,
      date: new Date(rawDate).toISOString(),
      location,
      status,
      ...(result ? { result } : {}),
      ...(final ? { score: `${uvaPoints}-${opponentPoints}` } : {}),
      ...(venue ? { venue } : {}),
      ...(network ? { network } : {}),
      ...(timeUnknown ? { timeUnknown: true } : {}),
      ...(headline || venue ? { note: [headline, venue].filter(Boolean).join(" · ") } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
      timeZone: UVA_TIME_ZONE,
    });
  }

  return games.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export function espnScheduleUrl(sport: "football" | "basketball", season: number, seasonType: 2 | 3, teamId = "258") {
  const path = sport === "football"
    ? "football/college-football"
    : "basketball/mens-college-basketball";
  return `https://site.api.espn.com/apis/site/v2/sports/${path}/teams/${teamId}/schedule?season=${season}&seasontype=${seasonType}`;
}
