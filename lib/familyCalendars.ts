/**
 * School-year and holiday-year references for My Vibe.
 *
 * Update this object when a new school year or official holiday year is published.
 * The website, `/api/family-calendars`, and the Monday holiday sync all read it.
 */
export const FAMILY_CALENDAR_CONFIG = {
  schoolYearLabel: "2026–2027",
  /** Calendar year shown on the federal and Virginia holiday links. */
  holidayYear: 2026,
  /**
   * Years written to Google Calendar. 2026–2027 matches the current school year.
   * Append the next year after OPM and Virginia DHRM publish it.
   */
  holidayYears: [2026, 2027],
  schools: {
    nps: {
      name: "Norfolk Public Schools",
      href: "https://resources.finalsite.net/images/v1787158396/npsk12vaus/rm1zlur7d3n0ulsey5rg/Academic_Calendar_26_27_1.pdf",
    },
    rps: {
      name: "Richmond Public Schools",
      href: "https://resources.finalsite.net/images/v1769534873/rvaschoolsnet/vgnamrglqdi6bnu5lq8j/2026-27RPSCalendar.pdf",
    },
    orchardHouse: {
      name: "Orchard House",
      href: "https://www.orchardhouse.org/school-events",
    },
  },
} as const;

export type FamilyCalendarLink = {
  id: string;
  label: string;
  href: string;
  detail: string;
};

export function federalHolidayListUrl(year: number) {
  return `https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/?year=${year}`;
}

export function virginiaHolidayListUrl(year: number) {
  return `https://www.dhrm.virginia.gov/docs/default-source/default-document-library/${year}-pay-and-holiday-calendar.pdf`;
}

export function familyCalendarLinks(
  config: typeof FAMILY_CALENDAR_CONFIG = FAMILY_CALENDAR_CONFIG,
): FamilyCalendarLink[] {
  const { schoolYearLabel, holidayYear, schools } = config;
  return [
    {
      id: "nps",
      label: `${schools.nps.name} ${schoolYearLabel} academic calendar`,
      href: schools.nps.href,
      detail: "Official Norfolk Public Schools calendar",
    },
    {
      id: "rps",
      label: `${schools.rps.name} ${schoolYearLabel} academic calendar`,
      href: schools.rps.href,
      detail: "Official Richmond Public Schools calendar",
    },
    {
      id: "orchard-house",
      label: `${schools.orchardHouse.name} ${schoolYearLabel} school calendar`,
      href: schools.orchardHouse.href,
      detail: "Official Orchard House Middle School calendar",
    },
    {
      id: "federal",
      label: `US federal holidays ${holidayYear}`,
      href: federalHolidayListUrl(holidayYear),
      detail: "Official list from the U.S. Office of Personnel Management",
    },
    {
      id: "virginia",
      label: `Virginia state holidays ${holidayYear}`,
      href: virginiaHolidayListUrl(holidayYear),
      detail: "Official list from the Virginia Department of Human Resource Management",
    },
  ];
}
