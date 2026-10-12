import test from "node:test";
import assert from "node:assert/strict";
import { parseEspnSchedule } from "../lib/uva/espnGames.ts";
import { refreshUvaSchedules } from "../lib/uva/refreshSchedules.ts";
import { memorySnapshotStore } from "../lib/snapshots/snapshotStore.ts";
import type { UvaFeedGame } from "../lib/uva/espnGames.ts";

const finalGame = {
  date: "2026-10-10T23:30:00Z",
  links: [{ rel: ["summary"], href: "https://www.espn.com/game" }],
  competitions: [{
    neutralSite: false,
    timeValid: true,
    venue: { fullName: "Scott Stadium" },
    broadcasts: [{ media: { shortName: "ACC Network" } }],
    status: { type: { name: "STATUS_FINAL", state: "post", completed: true, shortDetail: "Final" } },
    competitors: [
      { homeAway: "home", winner: true, score: { displayValue: "28" }, team: { id: "258", displayName: "Virginia Cavaliers" } },
      { homeAway: "away", winner: false, score: { displayValue: "25" }, team: { id: "183", displayName: "Syracuse Orange" } },
    ],
  }],
};

const postponed = {
  date: "2026-10-17T16:00:00Z",
  competitions: [{
    neutralSite: false,
    timeValid: false,
    venue: { fullName: "Gerald J. Ford Stadium" },
    status: { type: { name: "STATUS_POSTPONED", state: "pre", completed: false, shortDetail: "Postponed" } },
    competitors: [
      { homeAway: "away", score: { displayValue: "0" }, team: { id: "258", displayName: "Virginia Cavaliers" } },
      { homeAway: "home", score: { displayValue: "0" }, team: { id: "2567", displayName: "SMU Mustangs" } },
    ],
  }],
};

const neutral = {
  date: "2026-09-19T23:30:00Z",
  competitions: [{
    neutralSite: true,
    timeValid: true,
    venue: { fullName: "Bank of America Stadium" },
    notes: [{ headline: "Duke's Mayo Classic" }],
    status: { type: { name: "STATUS_FINAL", state: "post", completed: true, shortDetail: "Final" } },
    competitors: [
      { homeAway: "home", winner: false, score: { value: 27 }, team: { id: "258", displayName: "Virginia Cavaliers" } },
      { homeAway: "away", winner: true, score: { value: 38 }, team: { id: "277", displayName: "West Virginia Mountaineers" } },
    ],
  }],
};

function game(partial: Partial<UvaFeedGame> & Pick<UvaFeedGame, "id" | "opponent" | "date">): UvaFeedGame {
  return {
    sport: "football",
    location: "home",
    status: "scheduled",
    result: "pending",
    timeZone: "America/New_York",
    ...partial,
  };
}

test("ESPN games keep final scores, hide in-progress points, and mark postponements", () => {
  const games = parseEspnSchedule({ events: [finalGame, postponed, neutral] }, { sport: "football", season: 2026 });
  const syracuse = games.find((item) => item.opponent === "Syracuse Orange");
  assert.equal(syracuse?.status, "final");
  assert.equal(syracuse?.score, "28-25");
  assert.equal(syracuse?.result, "win");
  assert.equal(syracuse?.network, "ACCN");
  assert.equal(syracuse?.timeZone, "America/New_York");
  assert.equal(syracuse?.timeUnknown, undefined);
  assert.equal(syracuse?.sourceUrl, "https://www.espn.com/game");

  const smu = games.find((item) => item.opponent === "SMU Mustangs");
  assert.equal(smu?.status, "postponed");
  assert.equal(smu?.score, undefined);
  assert.equal(smu?.result, undefined);
  assert.equal(smu?.timeUnknown, true);
  assert.equal(smu?.location, "away");

  const westVirginia = games.find((item) => item.opponent === "West Virginia Mountaineers");
  assert.equal(westVirginia?.location, "neutral");
  assert.equal(westVirginia?.score, "27-38");
  assert.equal(westVirginia?.result, "loss");
  assert.match(westVirginia?.note ?? "", /Bank of America Stadium/);
});

test("a failed refresh keeps the last successful schedule and does not replace it", async () => {
  const previous = {
    updatedAt: "2026-10-05T13:00:00.000Z",
    footballSeason: 2026,
    basketballSeason: 2027,
    football: [game({ id: "fb", opponent: "Duke", date: "2026-10-23T23:00:00.000Z", score: undefined })],
    basketball: [game({ id: "bb", opponent: "Richmond", date: "2026-11-10T23:00:00.000Z", sport: "basketball" })],
    source: "previous",
  };
  let writes = 0;
  const store = memorySnapshotStore({ "uva-schedules": previous });
  const original = store.write.bind(store);
  store.write = async (key, payload) => {
    writes += 1;
    return original(key, payload);
  };
  const failed = await refreshUvaSchedules({
    store,
    now: new Date("2026-10-12T13:00:00.000Z"),
    football: async () => {
      throw new Error("ESPN down");
    },
    basketball: async () => {
      throw new Error("ESPN down");
    },
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.keptPrevious, true);
  assert.equal(failed.persisted, false);
  assert.equal(writes, 0);
  assert.equal(failed.snapshot?.football[0].opponent, "Duke");

  const partial = await refreshUvaSchedules({
    store,
    now: new Date("2026-10-12T13:00:00.000Z"),
    football: async () => ({
      games: [game({ id: "fb2", opponent: "SMU Mustangs", date: "2026-10-17T16:00:00.000Z", status: "final", result: "win", score: "31-14" })],
      source: "espn-football",
    }),
    basketball: async () => {
      throw new Error("basketball timeout");
    },
  });
  assert.equal(partial.ok, true);
  assert.equal(partial.persisted, true);
  assert.equal(partial.snapshot?.stale, true);
  assert.equal(partial.snapshot?.football[0].score, "31-14");
  assert.equal(partial.snapshot?.basketball[0].opponent, "Richmond");
});
