// app/api/uva/route.ts
import { NextResponse } from "next/server";
import { getUvaBasketballSchedule } from "@/lib/uvaBasketballSchedule";

export async function GET() {
  const response = await getUvaBasketballSchedule();
  return NextResponse.json(response);
}
