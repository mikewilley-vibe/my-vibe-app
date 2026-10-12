export type HolidaySource = "federal" | "virginia";

export type OfficialHoliday = {
  source: HolidaySource;
  year: number;
  name: string;
  /** Observed calendar date, YYYY-MM-DD. */
  date: string;
  /** Set when Virginia grants only part of the day. */
  partialHours?: number;
};

export const OPM_HOLIDAY_URL = "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/";
export const VIRGINIA_HOLIDAY_PAGE = "https://www.dhrm.virginia.gov/payandholidaycalendar";

const MONTHS: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

/** Observed federal holidays transcribed from OPM. Used when the live page cannot be read. */
export const BUNDLED_FEDERAL_HOLIDAYS: readonly OfficialHoliday[] = [
  ...rows("federal", 2026, [
    ["2026-01-01", "New Year’s Day"],
    ["2026-01-19", "Birthday of Martin Luther King, Jr."],
    ["2026-02-16", "Washington’s Birthday"],
    ["2026-05-25", "Memorial Day"],
    ["2026-06-19", "Juneteenth National Independence Day"],
    ["2026-07-03", "Independence Day"],
    ["2026-09-07", "Labor Day"],
    ["2026-10-12", "Columbus Day"],
    ["2026-11-11", "Veterans Day"],
    ["2026-11-26", "Thanksgiving Day"],
    ["2026-12-25", "Christmas Day"],
  ]),
  ...rows("federal", 2027, [
    ["2027-01-01", "New Year’s Day"],
    ["2027-01-18", "Birthday of Martin Luther King, Jr."],
    ["2027-02-15", "Washington’s Birthday"],
    ["2027-05-31", "Memorial Day"],
    ["2027-06-18", "Juneteenth National Independence Day"],
    ["2027-07-05", "Independence Day"],
    ["2027-09-06", "Labor Day"],
    ["2027-10-11", "Columbus Day"],
    ["2027-11-11", "Veterans Day"],
    ["2027-11-25", "Thanksgiving Day"],
    ["2027-12-24", "Christmas Day"],
  ]),
];

/**
 * Virginia state holidays from the DHRM pay and holiday calendars.
 * Additional holiday time is included so those days stay on the family calendar.
 * https://www.dhrm.virginia.gov/docs/default-source/default-document-library/2026-pay-and-holiday-calendar.pdf
 * https://www.dhrm.virginia.gov/docs/default-source/default-document-library/2027-pay-and-holiday-calendar.pdf
 */
export const BUNDLED_VIRGINIA_HOLIDAYS: readonly OfficialHoliday[] = [
  ...rows("virginia", 2026, [
    ["2026-01-01", "New Year’s Day"],
    ["2026-01-19", "Martin Luther King, Jr. Day"],
    ["2026-02-16", "George Washington Day"],
    ["2026-05-25", "Memorial Day"],
    ["2026-06-19", "Juneteenth"],
    ["2026-07-03", "Independence Day"],
    ["2026-09-07", "Labor Day"],
    ["2026-10-12", "Columbus Day and Yorktown Victory Day"],
    ["2026-11-03", "Election Day"],
    ["2026-11-11", "Veterans Day"],
    ["2026-11-25", "Additional holiday time (day before Thanksgiving)", 4],
    ["2026-11-26", "Thanksgiving"],
    ["2026-11-27", "Day After Thanksgiving"],
    ["2026-12-24", "Additional holiday time (Christmas Eve)", 8],
    ["2026-12-25", "Christmas"],
  ]),
  ...rows("virginia", 2027, [
    ["2027-01-01", "New Year’s Day"],
    ["2027-01-18", "Martin Luther King, Jr. Day"],
    ["2027-02-15", "George Washington Day"],
    ["2027-05-31", "Memorial Day"],
    ["2027-06-18", "Juneteenth"],
    ["2027-07-05", "Independence Day"],
    ["2027-09-06", "Labor Day"],
    ["2027-10-11", "Columbus Day and Yorktown Victory Day"],
    ["2027-11-02", "Election Day"],
    ["2027-11-11", "Veterans Day"],
    ["2027-11-24", "Additional holiday time (day before Thanksgiving)", 4],
    ["2027-11-25", "Thanksgiving"],
    ["2027-11-26", "Day After Thanksgiving"],
    ["2027-12-23", "Additional holiday time (Christmas Eve)", 4],
    ["2027-12-24", "Christmas"],
    ["2027-12-31", "New Year’s Day (observed)"],
  ]),
];

function rows(
  source: HolidaySource,
  year: number,
  entries: Array<[string, string] | [string, string, number]>,
): OfficialHoliday[] {
  return entries.map(([date, name, partialHours]) => ({
    source,
    year,
    name,
    date,
    ...(partialHours ? { partialHours } : {}),
  }));
}

export function holidayKey(holiday: Pick<OfficialHoliday, "source" | "year" | "name">) {
  const slug = holiday.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${holiday.source}:${holiday.year}:${slug}`;
}

export function holidayTitle(holiday: OfficialHoliday) {
  const prefix = holiday.source === "federal" ? "Federal holiday" : "Virginia holiday";
  if (holiday.partialHours) return `${prefix}: ${holiday.name} (${holiday.partialHours} hours)`;
  return `${prefix}: ${holiday.name}`;
}

export function holidayDescription(holiday: OfficialHoliday) {
  const source = holiday.source === "federal"
    ? `Official US federal holiday. Source: U.S. Office of Personnel Management. ${OPM_HOLIDAY_URL}`
    : `Official Virginia state holiday. Source: Virginia Department of Human Resource Management. ${VIRGINIA_HOLIDAY_PAGE}`;
  const hours = holiday.partialHours
    ? ` Virginia lists ${holiday.partialHours} hours of additional holiday time on this date.`
    : "";
  return `${source}${hours}`;
}

/** Pull observed dates from OPM's public holiday tables. */
export function parseOpmHolidays(html: string, years: number[]): OfficialHoliday[] {
  const wanted = new Set(years);
  const holidays: OfficialHoliday[] = [];
  const sections = html.matchAll(/<section class="tab-content" title="(\d{4})">([\s\S]*?)<\/section>/gi);
  for (const section of sections) {
    const year = Number(section[1]);
    if (!wanted.has(year)) continue;
    const rowsHtml = section[2].matchAll(/<tr>([\s\S]*?)<\/tr>/gi);
    for (const row of rowsHtml) {
      const cells = [...row[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)].map((cell) =>
        decodeEntities(cell[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
      );
      if (cells.length < 2) continue;
      const date = parseOpmDate(cells[0], year);
      const name = cells[1].replace(/\*+/g, "").replace(/\s+/g, " ").trim();
      if (!date || !name) continue;
      holidays.push({ source: "federal", year, name, date });
    }
  }
  return holidays;
}

function parseOpmDate(raw: string, year: number): string | null {
  const text = decodeEntities(raw).replace(/\*/g, "").replace(/\s+/g, " ").trim();
  const match = text.match(/([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
  if (!match) return null;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return null;
  const day = match[2].padStart(2, "0");
  const listedYear = match[3] ? Number(match[3]) : year;
  return `${listedYear}-${month}-${day}`;
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

export function bundledFederalHolidays(years: number[]) {
  const wanted = new Set(years);
  return BUNDLED_FEDERAL_HOLIDAYS.filter((holiday) => wanted.has(holiday.year));
}

export function bundledVirginiaHolidays(years: number[]) {
  const wanted = new Set(years);
  return BUNDLED_VIRGINIA_HOLIDAYS.filter((holiday) => wanted.has(holiday.year));
}
