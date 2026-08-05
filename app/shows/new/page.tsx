import Link from "next/link";
import { CalendarDays, ExternalLink, Check, ArrowLeft, Inbox, AlertTriangle } from "lucide-react";
import { supabaseServer } from "@/lib/supabaseServer";
import SectionHeader from "@/app/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

type VenueRel = { name: string } | { name: string }[] | null;

type VenueEvent = {
  id: string;
  title: string;
  event_date: string | null;
  event_url: string | null;
  first_seen_at: string | null;
  venues: VenueRel;
};

function venueName(venues: VenueRel): string {
  if (!venues) return "Unknown venue";
  if (Array.isArray(venues)) return venues[0]?.name ?? "Unknown venue";
  return venues.name || "Unknown venue";
}

function formatEventDate(value: string | null): string {
  if (!value) return "Date TBA";
  const parsed = new Date(value.length <= 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSeenAt(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function NewShowsPage() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("venue_events")
    .select("id, title, event_date, event_url, first_seen_at, venues(name)")
    .eq("seen", false)
    .order("first_seen_at", { ascending: false })
    .limit(200);

  const items = (data ?? []) as VenueEvent[];
  const count = items.length;

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/shows"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--harbor)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Shows
          </Link>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Inbox"
            title="New shows"
            description={
              error
                ? "Unseen events from monitored Hampton Roads, Richmond, and DC venues."
                : count === 0
                  ? "You're caught up — no unseen venue listings right now."
                  : `${count} unseen event${count === 1 ? "" : "s"} from monitored venues.`
            }
            className="mb-0"
          />

          {!error && (
            <div
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--fog)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--harbor)]"
              aria-live="polite"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full bg-[var(--harbor)] opacity-75 ${count > 0 ? "animate-ping" : ""}`}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--harbor)]" />
              </span>
              {count} unseen
            </div>
          )}
        </div>

        {!error && count > 0 && (
          <div className="mb-6">
            <form action="/shows/new/mark-all-seen" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--fog)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--harbor)]/35"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Mark all as seen
              </button>
            </form>
          </div>
        )}

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-lg font-semibold text-rose-900">
                  Couldn&apos;t load new shows
                </h2>
                <p className="text-sm text-rose-800/90">{error.message}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/shows/new"
                    className="inline-flex items-center rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Try again
                  </Link>
                  <Link
                    href="/shows"
                    className="inline-flex items-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-50"
                  >
                    Back to Shows
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : count === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--fog)] bg-white/70 px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fog)]/60 text-[var(--ink-muted)]">
              <Inbox className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              You&apos;re all caught up
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--ink-muted)]">
              No unseen venue events right now. Check back after the next scan, or browse your full show list.
            </p>
            <Link
              href="/shows"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--harbor)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Browse shows
            </Link>
          </div>
        ) : (
          <ul className="space-y-3" aria-label={`${count} unseen events`}>
            {items.map((event) => {
              const venue = venueName(event.venues);
              const seenLabel = formatSeenAt(event.first_seen_at);

              return (
                <li key={event.id}>
                  <article className="rounded-2xl border border-[var(--fog)] bg-white/90 p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
                            {venue}
                          </span>
                          {seenLabel && (
                            <span className="text-xs text-[var(--ink-muted)]">
                              First seen {seenLabel}
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-lg font-semibold leading-snug text-[var(--ink)]">
                          {event.title}
                        </h2>

                        <p className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <time dateTime={event.event_date ?? undefined}>
                            {formatEventDate(event.event_date)}
                          </time>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                        {event.event_url ? (
                          <a
                            href={event.event_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--harbor)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                            aria-label={`Open ${event.title} (opens in a new tab)`}
                          >
                            Open event
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-xl border border-dashed border-[var(--fog)] px-4 py-2 text-sm text-[var(--ink-muted)]">
                            No link
                          </span>
                        )}

                        <form action="/shows/new/mark-seen" method="post">
                          <input type="hidden" name="id" value={event.id} />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--fog)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--harbor)]/35"
                            aria-label={`Mark ${event.title} as seen`}
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            Mark seen
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
