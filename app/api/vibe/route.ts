import { NextResponse } from "next/server";

export async function GET() {
  const vibe = {
    message: "Day 3: You’re shipping full-stack features 💽⚡",
    mood: "locked-in",
    date: new Date().toISOString(),
  };

  return NextResponse.json(vibe);
}