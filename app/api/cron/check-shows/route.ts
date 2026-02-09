import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { extractEventsFromHtml } from "@/lib/showExtractor";
import { Resend } from "resend";

export const runtime = "nodejs";

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "mikewilley.app show monitor (+https://www.mikewilley.app/shows)",
    },
    // prevent caching surprises
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return await res.text();
}

export async function GET(req: Request) {
  // simple auth guard for cron
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: venues, error } = await supabase
    .from("venues")
    .select("*")
    .eq("active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const newlyFound: { venueName: string; title: string; url?: string | null; date?: string | null }[] = [];

  for (const v of venues ?? []) {
    try {
      const html = await fetchHtml(v.url);
      const { events, contentHash } = extractEventsFromHtml({
        html,
        baseUrl: v.url,
        selector: v.selector,
      });

      // update venue last check
      await supabase
        .from("venues")
        .update({
          last_checked_at: new Date().toISOString(),
          last_hash: contentHash,
        })
        .eq("id", v.id);

      // insert any new events
      for (const e of events) {
        const ins = await supabase.from("venue_events").insert({
          venue_id: v.id,
          title: e.title,
          event_date: e.event_date,
          event_url: e.event_url,
          fingerprint: e.fingerprint,
        });

        // insert will error on unique constraint if already exists; ignore that
        if (!ins.error) {
          newlyFound.push({
            venueName: v.name,
            title: e.title,
            url: e.event_url,
            date: e.event_date,
          });
        }
      }
    } catch (err: any) {
      // Don't fail the whole cron for one venue
      console.error("Venue check failed:", v?.name, err?.message);
    }
  }

  

  return NextResponse.json({
    ok: true,
    checked: venues?.length ?? 0,
    newEvents: newlyFound.length,
  });
}
