import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { holidayKey, holidayTitle, parseOpmHolidays, type OfficialHoliday } from "../lib/holidays/official.ts";
import { planHolidaySync, type ManagedHolidayEvent } from "../lib/holidays/syncPlan.ts";
import { GOOGLE_CALENDAR_SCOPE, holidayEventBody, missingGoogleCalendarEnv, signServiceAccountJwt, syncOfficialHolidays } from "../lib/holidays/googleSync.ts";
import { memorySnapshotStore } from "../lib/snapshots/snapshotStore.ts";
import { familyCalendarLinks } from "../lib/familyCalendars.ts";

const christmas: OfficialHoliday = { source: "federal", year: 2026, name: "Christmas Day", date: "2026-12-25" };
const election: OfficialHoliday = { source: "virginia", year: 2026, name: "Election Day", date: "2026-11-03" };
const independence: OfficialHoliday = { source: "federal", year: 2026, name: "Independence Day", date: "2026-07-03" };

function managed(partial: Partial<ManagedHolidayEvent> & Pick<ManagedHolidayEvent, "id" | "key" | "date" | "summary">): ManagedHolidayEvent {
  return { description: "", ...partial };
}

test("holiday sync is idempotent, updates moved dates, and removes dropped dates", () => {
  const desired = [christmas, election, independence];
  const first = planHolidaySync(desired, []);
  assert.equal(first.insert.length, 3);
  assert.equal(first.update.length, 0);
  assert.equal(first.remove.length, 0);

  const existing = desired.map((holiday, index) => managed({
    id: `event-${index}`,
    key: holidayKey(holiday),
    date: holiday.date,
    summary: holidayTitle(holiday),
    description: holidayEventBody(holiday).description,
    source: holiday.source,
  }));
  const second = planHolidaySync(desired, existing);
  assert.equal(second.insert.length, 0);
  assert.equal(second.update.length, 0);
  assert.equal(second.remove.length, 0);
  assert.equal(second.unchanged, 3);

  const moved = planHolidaySync(
    [{ ...independence, date: "2026-07-04" }, christmas, election],
    existing,
  );
  assert.equal(moved.insert.length, 0);
  assert.equal(moved.remove.length, 0);
  assert.equal(moved.update.length, 1);
  assert.equal(moved.update[0].holiday.date, "2026-07-04");
  assert.equal(moved.update[0].id, existing.find((event) => event.key.endsWith("independence-day"))?.id);

  const dropped = planHolidaySync([christmas, election], existing);
  assert.equal(dropped.remove.length, 1);
  assert.equal(dropped.remove[0].key, holidayKey(independence));
});

test("an existing same-day holiday is adopted instead of duplicated", () => {
  const plan = planHolidaySync([christmas], [
    managed({ id: "manual", key: "", date: "2026-12-25", summary: holidayTitle(christmas) }),
    managed({ id: "copy", key: "", date: "2026-12-25", summary: holidayTitle(christmas) }),
  ]);
  assert.equal(plan.insert.length, 0);
  assert.equal(plan.update.length, 1);
  assert.equal(plan.update[0].id, "manual");
  assert.equal(plan.remove.length, 1);
  assert.equal(plan.remove[0].id, "copy");
});

test("a failed official refresh does not delete previously synced holidays", () => {
  const existing = [managed({
    id: "keep",
    key: holidayKey(christmas),
    date: christmas.date,
    summary: holidayTitle(christmas),
    description: holidayEventBody(christmas).description,
    source: "federal",
  })];
  const plan = planHolidaySync([], existing);
  assert.equal(plan.remove.length, 0);
  assert.equal(plan.insert.length, 0);
});

test("OPM tables parse the requested year only", () => {
  const html = `
    <section class="tab-content" title="2026">
      <table><tr><td>Friday, July 03 <span class="Footnote">**</span></td><td>Independence Day</td></tr>
      <tr><td>Friday, December 25</td><td>Christmas Day</td></tr></table>
    </section>
    <section class="tab-content" title="2027">
      <table><tr><td>Monday, July 05</td><td>Independence Day</td></tr></table>
    </section>`;
  const holidays = parseOpmHolidays(html, [2026]);
  assert.deepEqual(holidays.map((holiday) => holiday.date), ["2026-07-03", "2026-12-25"]);
  assert.equal(holidays.every((holiday) => holiday.source === "federal"), true);
});

test("federal and Virginia holidays stay distinct", () => {
  assert.notEqual(holidayKey(christmas), holidayKey({ ...christmas, source: "virginia", name: "Christmas" }));
  assert.match(holidayTitle(christmas), /^Federal holiday:/);
  assert.match(holidayTitle(election), /^Virginia holiday:/);
});

test("Google service-account JWT requests the calendar events scope", () => {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const jwt = signServiceAccountJwt("sync@example.iam.gserviceaccount.com", pem, 1_700_000_000);
  const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
  assert.equal(payload.scope, GOOGLE_CALENDAR_SCOPE);
  assert.equal(payload.iss, "sync@example.iam.gserviceaccount.com");
});

test("holiday sync reports missing Google Calendar credentials and does not write", async () => {
  const previous = {
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  };
  delete process.env.GOOGLE_CALENDAR_ID;
  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  try {
    assert.deepEqual(missingGoogleCalendarEnv(), [
      "GOOGLE_CALENDAR_ID",
      "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    ]);
    const report = await syncOfficialHolidays({
      store: memorySnapshotStore(),
      years: [2026],
      fetchImpl: async () => {
        throw new Error("offline");
      },
    });
    assert.equal(report.configured, false);
    assert.equal(report.written, false);
    assert.equal(report.ok, true);
    assert.ok(report.desired > 10);
    assert.ok(report.missing?.includes("GOOGLE_CALENDAR_ID"));
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("family calendar links use the configured school year and official hosts", () => {
  const links = familyCalendarLinks();
  assert.deepEqual(links.map((link) => link.id), ["nps", "rps", "orchard-house", "federal", "virginia"]);
  assert.equal(links.every((link) => link.href.startsWith("https://")), true);
  assert.match(links[0].label, /2026\u20132027/);
  assert.match(links[3].label, /2026/);
  assert.match(links[3].href, /opm\.gov/);
  assert.match(links[4].href, /dhrm\.virginia\.gov/);
  assert.equal(links.some((link) => /2025/.test(link.href) || /Katie|Bea|Mary/.test(link.label)), false);
});
