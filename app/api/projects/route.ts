// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { projects } from "@/app/data/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    updatedAt: new Date().toISOString(),
    projects,
  });
}