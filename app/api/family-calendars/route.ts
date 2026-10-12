import { NextResponse } from "next/server";
import { FAMILY_CALENDAR_CONFIG, familyCalendarLinks } from "@/lib/familyCalendars";

export function GET() {
  return NextResponse.json({
    schoolYearLabel: FAMILY_CALENDAR_CONFIG.schoolYearLabel,
    holidayYear: FAMILY_CALENDAR_CONFIG.holidayYear,
    holidayYears: FAMILY_CALENDAR_CONFIG.holidayYears,
    links: familyCalendarLinks(),
  });
}
