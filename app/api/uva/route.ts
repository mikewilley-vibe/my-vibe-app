// app/api/uva/route.ts
import { NextResponse } from "next/server";

const API_BASE = "https://www.thesportsdb.com/api/v1/json";
const API_KEY = process.env.THESPORTSDB_API_KEY || "123";

// UVA team IDs from TheSportsDB
const UVA_FOOTBALL_ID = "136971";
const UVA_MBB_ID = "138622";

type RawEvent = {
  idEvent: string;
  dateEvent: string | null;
  strTime: string | null;
  strHomeTeam: string | null;
  strAwayTeam: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strSeason: string | null;
  strSport: string | null;
};
type RawTeam = {
  strTeam: string | null;
  strTeamBadge: string | null;
  strTeamLogo: string | null;
  strEquipment: string | null;
};

async function fetchTeamArt(teamId: string) {
  const url = `${API_BASE}/${API_KEY}/lookupteam.php?id=${teamId}`;
  const res = await fetch(url, { cache: "force-cache" });

  if (!res.ok) {
    console.error("Failed to fetch team art", teamId, res.status);
    return { teamBadge: undefined, teamLogo: undefined, equipmentArt: undefined };
  }

  const data = (await res.json()) as { teams?: RawTeam[] | null };
  const team = data.teams?.[0];

  if (!team) {
    return { teamBadge: undefined, teamLogo: undefined, equipmentArt: undefined };
  }

  return {
    teamBadge: team.strTeamBadge || undefined,
    teamLogo: team.strTeamLogo || undefined,
    equipmentArt: team.strEquipment || undefined,
  };
}
type UvaGame = {
  id: string;
  sport: "football" | "basketball";
  opponent: string;
  date: string;          // ISO
  location: "home" | "away";
  result: "win" | "loss" | "pending";
  score?: string;
  note?: string;
  teamBadge?: string;
  teamLogo?: string;
  equipmentArt?: string;
};

async function fetchEvents(
  endpoint: "eventslast" | "eventsnext",
  teamId: string,
  sport: "football" | "basketball"
): Promise<UvaGame[]> {
  const url = `${API_BASE}/${API_KEY}/${endpoint}.php?id=${teamId}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Failed to fetch ${endpoint} for ${teamId}`, res.status);
    return [];
  }

  const data = (await res.json()) as { results?: RawEvent[] | null; events?: RawEvent[] | null };

  // eventslast returns `results`, eventsnext returns `events`
  const events = data.results ?? data.events ?? [];
  if (!events) return [];

  return events
    .filter((event) => event.dateEvent)
    .map((event) => {
      const homeTeam = event.strHomeTeam ?? "";
      const awayTeam = event.strAwayTeam ?? "";

      const isHome = homeTeam.toLowerCase().includes("virginia");
      const opponent = isHome ? awayTeam : homeTeam;

      const homeScore = event.intHomeScore
        ? parseInt(event.intHomeScore, 10)
        : null;
      const awayScore = event.intAwayScore
        ? parseInt(event.intAwayScore, 10)
        : null;

      let result: UvaGame["result"] = "pending";
      let score: string | undefined;

      if (homeScore !== null && awayScore !== null) {
        score = `${homeScore}-${awayScore}`;

        const uvaScore = isHome ? homeScore : awayScore;
        const oppScore = isHome ? awayScore : homeScore;

        if (uvaScore > oppScore) result = "win";
        else if (uvaScore < oppScore) result = "loss";
      }

      const dateIso =
        event.dateEvent && event.strTime
          ? `${event.dateEvent}T${event.strTime}:00Z`
          : event.dateEvent
          ? `${event.dateEvent}T00:00:00Z`
          : new Date().toISOString();

      return {
        id: `${sport}-${event.idEvent}`,
        sport,
        opponent: opponent || "Opponent TBA",
        date: dateIso,
        location: isHome ? "home" : "away",
        result,
        score,
        note: `${homeTeam || "UVA"} vs ${awayTeam || "Opponent"}`,
      };
    });
}

async function fetchTeamAll(
  teamId: string,
  sport: "football" | "basketball"
): Promise<UvaGame[]> {
  const [lastGames, nextGames, art] = await Promise.all([
    fetchEvents("eventslast", teamId, sport),
    fetchEvents("eventsnext", teamId, sport),
    fetchTeamArt(teamId),
  ]);

  const sortedLast = lastGames.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastFive = sortedLast.slice(0, 5);

  const map = new Map<string, UvaGame>();
  for (const g of [...lastFive, ...nextGames]) {
    map.set(g.id, {
      ...g,
      teamBadge: art.teamBadge,
      teamLogo: art.teamLogo,
      equipmentArt: art.equipmentArt,
    });
  }

  return Array.from(map.values());
}

export async function GET() {
  try {
    const [footballGames, basketballGames] = await Promise.all([
      fetchTeamAll(UVA_FOOTBALL_ID, "football"),
      fetchTeamAll(UVA_MBB_ID, "basketball"),
    ]);

    const games = [...footballGames, ...basketballGames].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      games,
    });
  } catch (err) {
    console.error("Error building UVA games", err);
    return NextResponse.json(
      { error: "Failed to fetch UVA games" },
      { status: 500 }
    );
  }
}