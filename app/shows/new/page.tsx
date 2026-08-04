import Link from "next/link";
import { CalendarDays, ExternalLink, Check, ArrowLeft, Inbox, AlertTriangle } from "lucide-react";
import { supabaseServer } from "@/lib/supabaseServer";

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white overflow-x-hidden">
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/shows"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Shows
          </Link>
        </nav>

        <header className="mb-8 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Venue monitor
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                New shows
              </h1>
              <p className="max-w-xl text-base text-slate-600">
                Unseen events from your watched venues across Hampton Roads, Richmond, and DC.
              </p>
            </div>

            {!error && (
              <div
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"
                aria-live="polite"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 ${count > 0 ? "animate-ping" : ""}`}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                </span>
                {count} unseen
              </div>
            )}
          </div>

          {!error && count > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <form action="/shows/new/mark-all-seen" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Mark all as seen
                </button>
              </form>
            </div>
          )}
        </header>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50/80 p-6 sm:p-8"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-red-900">
                  Couldn&apos;t load new shows
                </h2>
                <p className="text-sm text-red-800/90">{error.message}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/shows/new"
                    className="inline-flex items-center rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    Try again
                  </Link>
                  <Link
                    href="/shows"
                    className="inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    Back to Shows
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : count === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Inbox className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">You&apos;re all caught up</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              No unseen venue events right now. Check back after the next scan, or browse your full show list.
            </p>
            <Link
              href="/shows"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                  <article className="group rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:border-blue-200 hover:shadow-md sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {venue}
                          </span>
                          {seenLabel && (
                            <span className="text-xs text-slate-500">
                              First seen {seenLabel}
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-semibold leading-snug text-slate-900">
                          {event.title}
                        </h2>

                        <p className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
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
                            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            aria-label={`Open ${event.title} (opens in a new tab)`}
                          >
                            Open event
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-200 px-4 py-2 text-sm text-slate-400">
                            No link
                          </span>
                        )}

                        <form action="/shows/new/mark-seen" method="post">
                          <input type="hidden" name="id" value={event.id} />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
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
      </section>
    </div>
  );
}
