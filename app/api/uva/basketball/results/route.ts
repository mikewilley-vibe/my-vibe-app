// app/api/uva/basketball/results/route.ts
import { NextResponse } from "next/server";

type ResultGame = {
  dateIso: string;
  opponent: string;
  score: string; // "W 72–65"
  homeAway?: "home" | "away" | "neutral";
  sourceUrl?: string;
};

function norm(v: any) {
  return String(v ?? "").toLowerCase();
}

function scoreFromCompetitor(c: any): number | null {
  const raw = c?.score ?? null;
  if (raw === null || raw === undefined) return null;

  // If ESPN gives an object like { value: 87, displayValue: "87" }
  if (typeof raw === "object") {
    const v = raw?.value ?? raw?.displayValue ?? raw?.display ?? null;
    if (v === null || v === undefined) return null;
    const n = Number(String(v).trim());
    return Number.isFinite(n) ? n : null;
  }

  // If it’s already a string/number
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  const teamId = process.env.UVA_NCAAM_TEAM_ID ?? "258";
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamId}/schedule`;

  const debugMode = new URL(req.url).searchParams.get("debug") === "1";

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        updatedAt: new Date().toISOString(),
        results: [],
        error: `ESPN upstream not ok: ${res.status}`,
      });
    }

    const json = await res.json();
    const items = json?.events ?? json?.items ?? [];

    // ---- DEBUG SAMPLE (1 final game) ----
    const sampleFinal = items.find((it: any) => {
      const ev = it?.event ?? it;
      const comp = (ev?.competitions ?? [])[0];
      const t = comp?.status?.type;
      return (
        t?.completed ||
        norm(t?.name).includes("final") ||
        norm(t?.detail).includes("final") ||
        norm(t?.state) === "post"
      );
    });

    const sampleEv = sampleFinal?.event ?? sampleFinal ?? null;
    const sampleComp = (sampleEv?.competitions ?? [])[0] ?? null;

    const sampleStatus = sampleComp?.status?.type ?? null;
    const sampleCompetitors = (sampleComp?.competitors ?? []).map((c: any) => ({
      teamId: String(c?.team?.id ?? ""),
      team: c?.team?.displayName ?? c?.team?.shortDisplayName ?? "",
      homeAway: c?.homeAway,
      scoreRaw: c?.score,
      scoreParsed: scoreFromCompetitor(c),
      winner: c?.winner,
    }));

    // ---- BUILD RESULTS ----
    const out: ResultGame[] = [];
    let finalsByStatus = 0;
    let finalsByScores = 0;

    for (const it of items) {
      const ev = it?.event ?? it;
      const dateIso = ev?.date ? new Date(ev.date).toISOString() : "";
      if (!dateIso) continue;

      const comp = (ev?.competitions ?? [])[0];
      if (!comp) continue;

      const competitors = comp?.competitors ?? [];
      const me = competitors.find((c: any) => String(c?.team?.id) === String(teamId));
      const opp = competitors.find((c: any) => String(c?.team?.id) !== String(teamId));
      if (!me || !opp) continue;

      const statusName = norm(comp?.status?.type?.name);
      const statusDetail = norm(comp?.status?.type?.detail);
      const state = norm(comp?.status?.type?.state);
      const completed = Boolean(comp?.status?.type?.completed);

      const isFinalByStatus =
        completed ||
        statusName.includes("final") ||
        statusDetail.includes("final") ||
        state === "post";

      if (isFinalByStatus) finalsByStatus++;

      const myScore = scoreFromCompetitor(me);
      const oppScore = scoreFromCompetitor(opp);

      const isFinalByScores = myScore !== null && oppScore !== null;
      if (isFinalByScores) finalsByScores++;

      // only show if we can actually compute the score
      if (!isFinalByScores) continue;

      const opponent =
        opp?.team?.displayName ?? opp?.team?.shortDisplayName ?? "Opponent";

      const won = myScore! > oppScore!;

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

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      results: out,
      ...(debugMode
        ? {
            debug: {
              teamId,
              itemsCount: items.length,
              finalsByStatus,
              finalsByScores,
              sampleStatus,
              sampleCompetitors,
              sampleEvDate: sampleEv?.date,
              sampleEvName: sampleEv?.name,
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