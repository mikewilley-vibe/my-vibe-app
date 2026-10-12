import { NextResponse } from "next/server";
import { cronAuthorized, cronUnconfigured } from "@/lib/cronAuth";
import { syncOfficialHolidays } from "@/lib/holidays/googleSync";
import { createSnapshotStore } from "@/lib/snapshots/snapshotStore";
import { refreshUvaSchedules, type RefreshResult } from "@/lib/uva/refreshSchedules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function summarizeUva(result: RefreshResult) {
  const games = [
    ...(result.snapshot?.football ?? []),
    ...(result.snapshot?.basketball ?? []),
  ];
  return {
    ok: result.ok,
    persisted: result.persisted,
    keptPrevious: result.keptPrevious,
    updatedAt: result.snapshot?.updatedAt ?? null,
    football: result.snapshot?.football.length ?? 0,
    basketball: result.snapshot?.basketball.length ?? 0,
    source: result.snapshot?.source ?? null,
    stale: Boolean(result.snapshot?.stale),
    error: result.error,
    games: games.map((game) => ({
      sport: game.sport,
      opponent: game.opponent,
      date: game.date,
      status: game.status,
      score: game.score ?? null,
      timeZone: game.timeZone,
      timeUnknown: Boolean(game.timeUnknown),
      network: game.network ?? null,
    })),
  };
}

export async function GET(req: Request) {
  if (cronUnconfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "CRON_SECRET is not set on this deployment",
    });
  }
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
  const store = createSnapshotStore();
  const [uva, holidays] = await Promise.all([
    refreshUvaSchedules({ store }),
    syncOfficialHolidays({ store, dryRun }),
  ]);
  return NextResponse.json({
    ok: uva.ok && holidays.ok,
    uva: summarizeUva(uva),
    holidays,
  });
}
