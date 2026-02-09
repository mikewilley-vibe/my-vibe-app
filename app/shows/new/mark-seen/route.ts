import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id")?.toString();

  if (!id) return NextResponse.redirect(new URL("/shows/new", req.url));

  const supabase = supabaseServer();
  await supabase.from("venue_events").update({ seen: true }).eq("id", id);

  return NextResponse.redirect(new URL("/shows/new", req.url));
}
