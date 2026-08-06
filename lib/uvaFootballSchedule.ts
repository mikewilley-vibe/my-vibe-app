// lib/uvaFootballSchedule.ts
import https from "node:https";
import { uvaGames as staticUvaGames } from "@/app/data/UvaSports";

export type UvaFootballGame = {
  id: string;
  sport: "football";
  opponent: string;
  date: string;
  location: "home" | "away" | "neutral";
  result?: "win" | "loss" | "pending";
  note?: string;
  sourceUrl?: string;
};

export type UvaFootballScheduleResponse = {
  ok: boolean;
  updatedAt: string;
  games: UvaFootballGame[];
  count: number;
  season: string;
  fallback?: boolean;
  error?: string;
  source?: string;
};

function norm(v: unknown) {
  return String(v ?? "").toLowerCase();
}

export function currentFootballSeason(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  return String(m < 6 ? y - 1 : y);
}

/** Direct HTTPS — avoids Cursor/dev HTTP_PROXY deadlocks on ESPN. */
function fetchJson(url: string, timeoutMs = 12_000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          accept: "application/json",
        },
        timeout: timeoutMs,
      },
      (res) => {
        if ((res.statusCode ?? 500) >= 400) {
          res.resume();
          reject(new Error(`ESPN HTTP ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ESPN request timed out"));
    });
    req.on("error", reject);
  });
}

function staticFootballFallback(): UvaFootballGame[] {
  const fromData = (staticUvaGames || [])
    .filter((g) => g.sport === "football")
    .map((g) => ({
      id: `uva-static-fb-${g.id}`,
      sport: "football" as const,
      opponent: g.opponent,
      date: new Date(g.date.length <= 10 ? `${g.date}T17:00:00-04:00` : g.date).toISOString(),
      location: g.location,
      result: g.result ?? "pending",
      note: g.note,
    }));

  // Seeded 2026 slate so the page still shows games if ESPN is blocked.
  const seeded2026: UvaFootballGame[] = [
    {
      id: "uva-fb-2026-ncst",
      sport: "football",
      opponent: "NC State Wolfpack",
      date: "2026-08-29T19:30:00.000Z",
      location: "home",
      result: "pending",
      note: "Location: Scott Stadium",
    },
    {
      id: "uva-fb-2026-nsu",
      sport: "football",
      opponent: "Norfolk State Spartans",
      date: "2026-09-11T23:00:00.000Z",
      location: "home",
      result: "pending",
      note: "Location: Scott Stadium",
    },
    {
      id: "uva-fb-2026-wvu",
      sport: "football",
      opponent: "West Virginia Mountaineers",
      date: "2026-09-19T23:30:00.000Z",
      location: "home",
      result: "pending",
      note: "Location: Scott Stadium",
    },
    {
      id: "uva-fb-2026-udel",
      sport: "football",
      opponent: "Delaware Blue Hens",
      date: "2026-09-26T16:00:00.000Z",
      location: "home",
      result: "pending",
      note: "Location: Scott Stadium",
    },
    {
      id: "uva-fb-2026-fsu",
      sport: "football",
      opponent: "Florida State Seminoles",
      date: "2026-10-03T16:00:00.000Z",
      location: "away",
      result: "pending",
    },
  ];

  const merged = [...seeded2026, ...fromData];
  return Array.from(new Map(merged.map((g) => [g.id, g])).values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function getUvaFootballSchedule(
  season = currentFootballSeason()
): Promise<UvaFootballScheduleResponse> {
  const teamId = process.env.UVA_NCAAF_TEAM_ID ?? "258";

  try {
    const urls = [
      `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamId}/schedule?season=${season}&seasontype=2`,
      `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamId}/schedule?season=${season}&seasontype=3`,
    ];

    const results = await Promise.allSettled(urls.map((u) => fetchJson(u)));
    const payloads = results
      .filter((r): r is PromiseFulfilledResult<unknown> => r.status === "fulfilled")
      .map((r) => r.value as { events?: unknown[]; items?: unknown[] });

    if (!payloads.length) {
      const fallback = staticFootballFallback();
      const reason =
        results.find((r) => r.status === "rejected")?.status === "rejected"
          ? String((results.find((r) => r.status === "rejected") as PromiseRejectedResult).reason)
          : "ESPN upstream failed";
      return {
        ok: true,
        updatedAt: new Date().toISOString(),
        games: fallback,
        count: fallback.length,
        season,
        fallback: true,
        error: reason,
      };
    }

    const items = payloads.flatMap((p) => p?.events ?? p?.items ?? []);
    const games: UvaFootballGame[] = [];

    for (const it of items) {
      const ev = (it as { event?: Record<string, unknown> }).event ?? (it as Record<string, unknown>);
      const dateIso = ev?.date ? new Date(String(ev.date)).toISOString() : "";
      if (!dateIso) continue;

      const competitions = (ev?.competitions as unknown[]) ?? [];
      const comp = competitions[0] as {
        status?: { type?: { name?: string; detail?: string; state?: string; completed?: boolean } };
        competitors?: Array<{
          team?: { id?: string | number; displayName?: string; shortDisplayName?: string };
          homeAway?: string;
        }>;
        venue?: { fullName?: string; address?: { city?: string; state?: string } };
        links?: Array<{ href?: string }>;
      } | undefined;
      if (!comp) continue;

      const t = comp?.status?.type;
      const statusName = norm(t?.name);
      const statusDetail = norm(t?.detail);
      const state = norm(t?.state);
      const completed = Boolean(t?.completed);

      const isFinal =
        completed ||
        statusName.includes("final") ||
        statusDetail.includes("final") ||
        state === "post";

      if (isFinal) continue;

      const competitors = comp?.competitors ?? [];
      const me = competitors.find((c) => String(c?.team?.id) === String(teamId));
      const opp = competitors.find((c) => String(c?.team?.id) !== String(teamId));
      if (!me || !opp) continue;

      const opponent =
        opp?.team?.displayName ?? opp?.team?.shortDisplayName ?? "Opponent TBA";

      const ha = norm(me?.homeAway);
      const location: UvaFootballGame["location"] =
        ha === "home" || ha === "away" ? ha : "neutral";

      const place =
        comp?.venue?.fullName ||
        [comp?.venue?.address?.city, comp?.venue?.address?.state].filter(Boolean).join(", ");

      const links = (ev?.links as Array<{ rel?: string[]; href?: string }> | undefined) ?? [];
      const sourceUrl =
        links.find((l) => l?.rel?.includes("summary"))?.href ??
        links?.[0]?.href ??
        comp?.links?.[0]?.href ??
        undefined;

      games.push({
        id: `uva-fb-${dateIso}-${opponent.replace(/\s+/g, "-").toLowerCase()}`,
        sport: "football",
        opponent,
        date: dateIso,
        location,
        result: "pending",
        note: place ? `Location: ${place}` : undefined,
        sourceUrl,
      });
    }

    games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const out = games.length ? games : staticFootballFallback();

    return {
      ok: true,
      updatedAt: new Date().toISOString(),
      games: out,
      count: out.length,
      season,
      fallback: !games.length,
      source: `espn:team/${teamId}/schedule?season=${season}`,
    };
  } catch (err: unknown) {
    const fallback = staticFootballFallback();
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: true,
      updatedAt: new Date().toISOString(),
      games: fallback,
      count: fallback.length,
      season,
      fallback: true,
      error: message,
    };
  }
}
