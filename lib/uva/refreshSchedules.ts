import {
  basketballSeasonYear,
  footballSeasonYear,
  type UvaFeedGame,
  type UvaScheduleSnapshot,
} from "@/lib/uva/espnGames";
import { fetchBasketballGames, fetchFootballGames } from "@/lib/uva/fetchSchedules";
import { createSnapshotStore, UVA_SNAPSHOT_KEY, type SnapshotStore } from "@/lib/snapshots/snapshotStore";

export type SportFetch = { games: UvaFeedGame[]; source: string };

export type RefreshDeps = {
  store?: SnapshotStore;
  now?: Date;
  football?: (season: number) => Promise<SportFetch>;
  basketball?: (season: number) => Promise<SportFetch>;
};

export type RefreshResult = {
  ok: boolean;
  persisted: boolean;
  keptPrevious: boolean;
  snapshot: UvaScheduleSnapshot | null;
  error?: string;
};

function message(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Pull the latest UVA football and men's basketball games.
 * A failed sport keeps that sport's last successful list. Nothing is written
 * when both fetches fail or the combined list would be empty.
 */
export async function refreshUvaSchedules(deps: RefreshDeps = {}): Promise<RefreshResult> {
  const store = deps.store ?? createSnapshotStore();
  const now = deps.now ?? new Date();
  const previous = await store.read<UvaScheduleSnapshot>(UVA_SNAPSHOT_KEY);
  const footballSeason = footballSeasonYear(now);
  const basketballSeason = basketballSeasonYear(now);
  const loadFootball = deps.football ?? fetchFootballGames;
  const loadBasketball = deps.basketball ?? fetchBasketballGames;

  const [footballResult, basketballResult] = await Promise.allSettled([
    loadFootball(footballSeason),
    loadBasketball(basketballSeason),
  ]);

  const footballOk = footballResult.status === "fulfilled" && footballResult.value.games.length > 0;
  const basketballOk = basketballResult.status === "fulfilled" && basketballResult.value.games.length > 0;
  if (!footballOk && !basketballOk) {
    const error = [
      footballResult.status === "rejected" ? message(footballResult.reason) : "Football schedule was empty",
      basketballResult.status === "rejected" ? message(basketballResult.reason) : "Basketball schedule was empty",
    ].join("; ");
    return { ok: false, persisted: false, keptPrevious: Boolean(previous), snapshot: previous, error };
  }

  const snapshot: UvaScheduleSnapshot = {
    updatedAt: new Date().toISOString(),
    footballSeason,
    basketballSeason,
    football: footballOk ? footballResult.value.games : previous?.football ?? [],
    basketball: basketballOk ? basketballResult.value.games : previous?.basketball ?? [],
    source: [
      footballOk ? footballResult.value.source : "previous-football",
      basketballOk ? basketballResult.value.source : "previous-basketball",
    ].join(" + "),
    ...(footballOk && basketballOk ? {} : { stale: true }),
  };

  if (!snapshot.football.length && !snapshot.basketball.length) {
    return {
      ok: false,
      persisted: false,
      keptPrevious: Boolean(previous),
      snapshot: previous,
      error: "Refresh produced no games",
    };
  }

  const persisted = await store.write(UVA_SNAPSHOT_KEY, snapshot);
  return { ok: true, persisted, keptPrevious: false, snapshot };
}

export async function readUvaSnapshot(store: SnapshotStore = createSnapshotStore()) {
  return store.read<UvaScheduleSnapshot>(UVA_SNAPSHOT_KEY);
}
