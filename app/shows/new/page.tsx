import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import SectionHeader from "@/app/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export default async function NewShowsPage() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("venue_events")
    .select("id, title, event_date, event_url, first_seen_at, venues(name)")
    .eq("seen", false)
    .order("first_seen_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <SectionHeader eyebrow="Inbox" title="New shows" />
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-sm text-rose-800">
          {error.message}
        </div>
        <Link href="/shows" className="mt-6 inline-block text-sm font-semibold text-[var(--harbor)]">
          ← Back to Shows
        </Link>
      </div>
    );
  }

  const items = data ?? [];

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Inbox"
            title="New shows"
            description={
              items.length === 0
                ? "You're caught up — no unseen venue listings right now."
                : `${items.length} unseen event${items.length === 1 ? "" : "s"} from monitored venues.`
            }
            className="mb-0"
          />
          <Link
            href="/shows"
            className="inline-flex shrink-0 items-center rounded-xl border border-[var(--fog)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--harbor)]/35"
          >
            ← Shows
          </Link>
        </div>

        <div className="space-y-3">
          {items.map((e: any) => {
            const venueName = Array.isArray(e.venues)
              ? e.venues[0]?.name
              : e.venues?.name;

            return (
              <article
                key={e.id}
                className="rounded-2xl border border-[var(--fog)] bg-white/90 p-4 sm:p-5 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
                  {venueName ?? "Venue"}
                </div>
                <h2 className="mt-1 font-display text-lg font-semibold text-[var(--ink)]">
                  {e.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {e.event_date ? e.event_date : "Date unknown"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {e.event_url ? (
                    <a
                      className="inline-flex rounded-xl bg-[var(--harbor)] px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                      href={e.event_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open event
                    </a>
                  ) : null}

                  <form action="/shows/new/mark-seen" method="post">
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      className="text-xs font-semibold text-[var(--ink-muted)] underline underline-offset-2 hover:text-[var(--ink)]"
                      type="submit"
                    >
                      Mark as seen
                    </button>
                  </form>
                </div>
              </article>
            );
          })}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--fog)] bg-white/70 px-6 py-12 text-center text-sm text-[var(--ink-muted)]">
              No new events right now.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
