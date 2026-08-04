import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  await supabase.from("venue_events").update({ seen: true }).eq("seen", false);

  return NextResponse.redirect(new URL("/shows/new", req.url));
}
