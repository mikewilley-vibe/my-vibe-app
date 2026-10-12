import { createSign } from "node:crypto";
import { FAMILY_CALENDAR_CONFIG } from "@/lib/familyCalendars";
import {
  bundledFederalHolidays,
  bundledVirginiaHolidays,
  holidayDescription,
  holidayKey,
  holidayTitle,
  OPM_HOLIDAY_URL,
  parseOpmHolidays,
  type OfficialHoliday,
} from "@/lib/holidays/official";
import { planHolidaySync, type ManagedHolidayEvent } from "@/lib/holidays/syncPlan";
import { HOLIDAY_SNAPSHOT_KEY, type SnapshotStore } from "@/lib/snapshots/snapshotStore";

export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type HolidayCalendarClient = {
  listManaged(timeMin: string, timeMax: string): Promise<ManagedHolidayEvent[]>;
  insert(holiday: OfficialHoliday): Promise<string>;
  update(id: string, holiday: OfficialHoliday): Promise<void>;
  remove(id: string): Promise<void>;
};

export type StoredHolidayList = {
  updatedAt: string;
  federalLive: boolean;
  federal: OfficialHoliday[];
  virginia: OfficialHoliday[];
};

const REQUIRED_ENV = [
  "GOOGLE_CALENDAR_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
] as const;

export function missingGoogleCalendarEnv() {
  return REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
}

export function signServiceAccountJwt(email: string, privateKeyPem: string, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: email,
    scope: GOOGLE_CALENDAR_SCOPE,
    aud: TOKEN_URL,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKeyPem).toString("base64url")}`;
}

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function privateKey() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
}

export function holidayEventBody(holiday: OfficialHoliday) {
  const start = holiday.date;
  const end = nextDate(start);
  return {
    summary: holidayTitle(holiday),
    description: holidayDescription(holiday),
    start: { date: start },
    end: { date: end },
    transparency: "transparent",
    extendedProperties: {
      private: {
        myVibeHoliday: "1",
        myVibeHolidayKey: holidayKey(holiday),
        myVibeHolidaySource: holiday.source,
      },
    },
  };
}

function nextDate(isoDay: string) {
  const [year, month, day] = isoDay.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

type GoogleEvent = {
  id?: string;
  summary?: string;
  description?: string;
  start?: { date?: string; dateTime?: string };
  extendedProperties?: { private?: Record<string, string> };
};

function fromGoogle(event: GoogleEvent): ManagedHolidayEvent | null {
  if (!event.id) return null;
  const date = event.start?.date || event.start?.dateTime?.slice(0, 10) || "";
  if (!date) return null;
  return {
    id: event.id,
    key: event.extendedProperties?.private?.myVibeHolidayKey || "",
    date,
    summary: event.summary || "",
    description: event.description || "",
    source: event.extendedProperties?.private?.myVibeHolidaySource,
  };
}

export function createGoogleHolidayClient(): HolidayCalendarClient {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!.trim();
  let token: Promise<string> | null = null;
  const authorize = () => {
    token ??= (async () => {
      const assertion = signServiceAccountJwt(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!.trim(), privateKey());
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion,
        }),
      });
      const body = await response.json() as { access_token?: string; error?: string };
      if (!response.ok || !body.access_token) {
        throw new Error(body.error || `Google token request failed (${response.status})`);
      }
      return body.access_token;
    })();
    return token;
  };

  async function calendarFetch(path: string, init?: RequestInit) {
    const accessToken = await authorize();
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google Calendar ${response.status}: ${text.slice(0, 300)}`);
    }
    return response;
  }

  return {
    async listManaged(timeMin, timeMax) {
      const events: ManagedHolidayEvent[] = [];
      let pageToken = "";
      do {
        const params = new URLSearchParams({
          singleEvents: "true",
          maxResults: "250",
          timeMin,
          timeMax,
          orderBy: "startTime",
        });
        if (pageToken) params.set("pageToken", pageToken);
        const response = await calendarFetch(`/events?${params.toString()}`);
        const body = await response.json() as { items?: GoogleEvent[]; nextPageToken?: string };
        for (const item of body.items ?? []) {
          const managed = fromGoogle(item);
          if (managed) events.push(managed);
        }
        pageToken = body.nextPageToken ?? "";
      } while (pageToken);
      return events;
    },
    async insert(holiday) {
      const response = await calendarFetch("/events", {
        method: "POST",
        body: JSON.stringify(holidayEventBody(holiday)),
      });
      const body = await response.json() as { id?: string };
      if (!body.id) throw new Error("Google Calendar insert did not return an id");
      return body.id;
    },
    async update(id, holiday) {
      await calendarFetch(`/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(holidayEventBody(holiday)),
      });
    },
    async remove(id) {
      await calendarFetch(`/events/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
  };
}

async function loadFederal(years: number[], fetchImpl: typeof fetch) {
  const response = await fetchImpl(OPM_HOLIDAY_URL, {
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "MyVibe holiday sync", accept: "text/html" },
  });
  if (!response.ok) throw new Error(`OPM HTTP ${response.status}`);
  const parsed = parseOpmHolidays(await response.text(), years);
  if (parsed.length < years.length * 10) throw new Error("OPM holiday page did not include the requested years");
  return parsed;
}

export async function resolveOfficialHolidays(
  years: number[],
  store: SnapshotStore,
  fetchImpl: typeof fetch = fetch,
): Promise<{ holidays: OfficialHoliday[]; federalLive: boolean }> {
  const virginia = bundledVirginiaHolidays(years);
  try {
    const federal = await loadFederal(years, fetchImpl);
    const payload: StoredHolidayList = {
      updatedAt: new Date().toISOString(),
      federalLive: true,
      federal,
      virginia,
    };
    await store.write(HOLIDAY_SNAPSHOT_KEY, payload);
    return { holidays: [...federal, ...virginia], federalLive: true };
  } catch {
    const previous = await store.read<StoredHolidayList>(HOLIDAY_SNAPSHOT_KEY);
    const federal = previous?.federal?.length
      ? previous.federal.filter((holiday) => years.includes(holiday.year))
      : bundledFederalHolidays(years);
    return { holidays: [...federal, ...virginia], federalLive: false };
  }
}

export type HolidaySyncReport = {
  ok: boolean;
  configured: boolean;
  written: boolean;
  dryRun: boolean;
  federalLive: boolean;
  missing?: string[];
  years: number[];
  desired: number;
  insert: number;
  update: number;
  remove: number;
  unchanged: number;
  error?: string;
};

export async function syncOfficialHolidays(options: {
  store: SnapshotStore;
  dryRun?: boolean;
  years?: number[];
  client?: HolidayCalendarClient;
  fetchImpl?: typeof fetch;
}): Promise<HolidaySyncReport> {
  const years = options.years ?? [...FAMILY_CALENDAR_CONFIG.holidayYears];
  const { holidays, federalLive } = await resolveOfficialHolidays(years, options.store, options.fetchImpl);
  const base = {
    federalLive,
    years,
    desired: holidays.length,
    dryRun: Boolean(options.dryRun),
    insert: 0,
    update: 0,
    remove: 0,
    unchanged: 0,
  };
  if (!holidays.length) {
    return { ...base, ok: false, configured: missingGoogleCalendarEnv().length === 0, written: false, error: "No official holidays to sync" };
  }

  const missing = missingGoogleCalendarEnv();
  if (!options.client && missing.length) {
    return { ...base, ok: true, configured: false, written: false, missing: [...missing] };
  }

  try {
    const client = options.client ?? createGoogleHolidayClient();
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const existing = await client.listManaged(`${minYear}-01-01T00:00:00Z`, `${maxYear + 1}-01-15T00:00:00Z`);
    const plan = planHolidaySync(holidays, existing);
    const counts = {
      insert: plan.insert.length,
      update: plan.update.length,
      remove: plan.remove.length,
      unchanged: plan.unchanged,
    };
    if (options.dryRun) {
      return { ...base, ...counts, ok: true, configured: true, written: false };
    }
    for (const holiday of plan.insert) await client.insert(holiday);
    for (const change of plan.update) await client.update(change.id, change.holiday);
    for (const event of plan.remove) await client.remove(event.id);
    return { ...base, ...counts, ok: true, configured: true, written: true };
  } catch (error) {
    return {
      ...base,
      ok: false,
      configured: true,
      written: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
