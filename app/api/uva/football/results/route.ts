// app/api/uva/football/results/route.ts
import { NextResponse } from "next/server";

type ResultGame = {
  dateIso: string;
  opponent: string;
  score: string; // "W 27–24"
  homeAway?: "home" | "away" | "neutral";
  sourceUrl?: string;
};

function norm(v: any) {
  return String(v ?? "").toLowerCase();
}

function deepPickNumber(value: any, depth = 0): number | null {
  if (depth > 4) return null;

  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : null;
  }

  if (typeof value === "object") {
    // common ESPN keys
    const keys = ["value", "displayValue", "display", "score", "points", "total"];
    for (const k of keys) {
      const hit = deepPickNumber((value as any)[k], depth + 1);
      if (hit !== null) return hit;
    }

    // last resort: scan a few values
    for (const v of Object.values(value)) {
      const hit = deepPickNumber(v, depth + 1);
      if (hit !== null) return hit;
    }
  }

  return null;
}

function scoreFromCompetitor(c: any): number | null {
  // ESPN sometimes uses:
  // c.score -> "27" or 27 OR { value: 27 } OR { displayValue: "27" } etc.
  return deepPickNumber(c?.score);
}

async function fetchSchedule(teamId: string, season: string, seasontype: "2" | "3") {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamId}/schedule?season=${season}&seasontype=${seasontype}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      accept: "application/json",
    },
  });

  return { url, res };
}

export async function GET(req: Request) {
  const teamId = process.env.UVA_NCAAF_TEAM_ID ?? process.env.UVA_NCAAM_TEAM_ID ?? "258";
  const season = new URL(req.url).searchParams.get("season") ?? "2025";
  const debug = new URL(req.url).searchParams.get("debug") === "1";

  try {
    const [reg, post] = await Promise.all([
      fetchSchedule(teamId, season, "2"),
      fetchSchedule(teamId, season, "3"),
    ]);

    if (!reg.res.ok && !post.res.ok) {
      return NextResponse.json({
        ok: false,
        updatedAt: new Date().toISOString(),
        results: [],
        error: `ESPN upstream not ok: reg=${reg.res.status} post=${post.res.status}`,
      });
    }

    const regJson = reg.res.ok ? await reg.res.json() : null;
    const postJson = post.res.ok ? await post.res.json() : null;

    const regItems = regJson?.events ?? regJson?.items ?? [];
    const postItems = postJson?.events ?? postJson?.items ?? [];
    const items = [...regItems, ...postItems];

    const out: ResultGame[] = [];
    let finalsFound = 0;
    let finalsWithScores = 0;
    let sampleFinal: any = null;

    for (const it of items) {
      const ev = it?.event ?? it;
      const dateIso = ev?.date ? new Date(ev.date).toISOString() : "";
      if (!dateIso) continue;

      const comp = (ev?.competitions ?? [])[0];
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

      if (!isFinal) continue;
      finalsFound++;

      if (!sampleFinal) sampleFinal = ev;

      const competitors = comp?.competitors ?? [];
      const me = competitors.find((c: any) => String(c?.team?.id) === String(teamId));
      const opp = competitors.find((c: any) => String(c?.team?.id) !== String(teamId));
      if (!me || !opp) continue;

      const myScore = scoreFromCompetitor(me);
      const oppScore = scoreFromCompetitor(opp);

      // Only include entries where we can actually render a real score
      if (myScore === null || oppScore === null) continue;
      finalsWithScores++;

      const opponent =
        opp?.team?.displayName ?? opp?.team?.shortDisplayName ?? "Opponent";

      const won = myScore > oppScore;

      const ha = norm(me?.homeAway);
      const homeAway: "home" | "away" | "neutral" =
        ha === "home" || ha === "away" ? (ha as any) : "neutral";

      const sourceUrl =
        ev?.links?.[0]?.href ??
        comp?.links?.[0]?.href ??
        undefined;

      out.push({
        dateIso,
        opponent,
        score: `${won ? "W" : "L"} ${myScore}\u2013${oppScore}`,
        homeAway,
        sourceUrl,
      });
    }

    out.sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime());

    // In case ESPN returns “final” statuses but weird score shapes,
    // debug will show you exactly what their score fields look like.
    const sampleComp = sampleFinal ? (sampleFinal?.competitions ?? [])[0] : null;
    const sampleCompetitors = (sampleComp?.competitors ?? []).map((c: any) => ({
      teamId: String(c?.team?.id ?? ""),
      team: c?.team?.displayName ?? c?.team?.shortDisplayName ?? "",
      homeAway: c?.homeAway,
      scoreRaw: c?.score,
      scorePicked: scoreFromCompetitor(c),
      winner: c?.winner,
    }));

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      results: out,
      ...(debug
        ? {
            debug: {
              teamId,
              season,
              reg: { ok: reg.res.ok, status: reg.res.status, url: reg.url, itemsCount: regItems.length },
              post: { ok: post.res.ok, status: post.res.status, url: post.url, itemsCount: postItems.length },
              combinedItemsCount: items.length,
              finalsFound,
              finalsWithScores,
              sampleStatus: sampleComp?.status?.type ?? null,
              sampleCompetitors,
            },
          }
        : {}),
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      updatedAt: new Date().toISOString(),
      results: [],
      error: String(err?.message ?? err),
    });
  }
}