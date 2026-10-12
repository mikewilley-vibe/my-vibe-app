import { NextResponse } from "next/server";
import { getUvaBasketballSchedule } from "@/lib/uvaBasketballSchedule";
import { readUvaSnapshot, refreshUvaSchedules } from "@/lib/uva/refreshSchedules";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readUvaSnapshot();
  if (snapshot?.basketball.length) {
    return NextResponse.json({
      ok: true,
      status: 200,
      updatedAt: snapshot.updatedAt,
      games: snapshot.basketball,
      count: snapshot.basketball.length,
      source: snapshot.source,
      fallback: false,
      timeZone: "America/New_York",
      ...(snapshot.stale ? { stale: true } : {}),
    });
  }

  const refreshed = await refreshUvaSchedules();
  if (refreshed.snapshot?.basketball.length) {
    return NextResponse.json({
      ok: true,
      status: 200,
      updatedAt: refreshed.snapshot.updatedAt,
      games: refreshed.snapshot.basketball,
      count: refreshed.snapshot.basketball.length,
      source: refreshed.snapshot.source,
      fallback: false,
      timeZone: "America/New_York",
    });
  }

  return NextResponse.json(await getUvaBasketballSchedule());
}
