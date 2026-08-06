import ShowTabs from "./ShowTabs";
import { myArtists } from "@/app/data/myArtists";
import { myShows } from "@/app/data/myShows";
import ArtistRotator from "@/app/components/concerts/ArtistRotator";
import FadeIn from "@/app/components/motion/FadeIn";
import ScrollReveal from "@/app/components/motion/ScrollReveal";
import SectionHeader from "@/app/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink } from "lucide-react";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type VenueRel = { name: string } | { name: string }[] | null;

type UpcomingVenueEvent = {
  id: string;
  title: string;
  event_date: string | null;
  event_url: string | null;
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
  });
}

export default async function ShowsPage() {
  const supabase = supabaseServer();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: venues }, { data: unseenCounts }, { data: nextVenueShows }] = await Promise.all([
    supabase
      .from("venues")
      .select("id, name, url, last_checked_at, active")
      .eq("active", true)
      .order("name"),
    supabase.from("venue_events").select("venue_id").eq("seen", false),
    supabase
      .from("venue_events")
      .select("id, title, event_date, event_url, venues(name)")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(3),
  ]);

  const unseenByVenue = new Map<string, number>();
  (unseenCounts ?? []).forEach((e: { venue_id: string }) => {
    unseenByVenue.set(e.venue_id, (unseenByVenue.get(e.venue_id) ?? 0) + 1);
  });

  const totalUnseen = unseenCounts?.length ?? 0;
  const upcomingCount = myShows.filter((s) => s.date >= today).length;
  const upcomingVenueEvents = (nextVenueShows ?? []) as UpcomingVenueEvent[];

  return (
    <div className="min-h-screen pb-16">
      <section className="relative isolate min-h-[min(72vh,620px)] overflow-hidden bg-[var(--ink)] text-white">
        <Image
          src="/images/shows-hero.png"
          alt="Live music"
          fill
          priority
          className="object-cover object-[center_25%] opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/92 via-[var(--ink)]/60 to-[var(--ink)]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/30" />

        <div className="relative z-10 mx-auto flex min-h-[min(72vh,620px)] max-w-6xl flex-col justify-between px-4 py-10 sm:py-14">
          <FadeIn>
            <div className="max-w-2xl space-y-4 pt-2 sm:pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Live music
              </p>
              <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
                Shows
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                Favorite artists and venues across Hampton Roads, Richmond, and DC —
                plus the shows already on your list.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#browse"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--signal)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Browse artists & venues
              </Link>

              <Link
                href="/shows/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
              >
                New from venues
                {totalUnseen > 0 ? (
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums">
                    {totalUnseen}
                  </span>
                ) : null}
              </Link>

              <div className="sm:ml-auto flex flex-wrap gap-4 text-sm text-white/75">
                <span>
                  <span className="font-semibold text-white">{myArtists.length}</span> artists
                </span>
                <span className="text-white/35">·</span>
                <span>
                  <span className="font-semibold text-white">{upcomingCount}</span> upcoming
                </span>
                {venues && venues.length > 0 ? (
                  <>
                    <span className="text-white/35">·</span>
                    <span>
                      <span className="font-semibold text-white">{venues.length}</span> monitored
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 space-y-16 pt-12 sm:pt-16">
        {upcomingVenueEvents.length > 0 && (
          <ScrollReveal>
            <section>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow="Coming up"
                  title="Next from venues"
                  description="The next three dated shows across every monitored room."
                  className="mb-0"
                />
                <Link
                  href="/shows/new"
                  className="inline-flex shrink-0 items-center self-start rounded-xl border border-[var(--fog)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--harbor)] transition hover:border-[var(--harbor)]/35"
                >
                  All venue listings →
                </Link>
              </div>

              <ul className="space-y-3" aria-label="Next three venue shows">
                {upcomingVenueEvents.map((event, idx) => {
                  const venue = venueName(event.venues);
                  return (
                    <li key={event.id}>
                      <article className="rounded-2xl border border-[var(--fog)] bg-white/90 p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {idx === 0 ? (
                                <span className="rounded-md bg-[var(--signal)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                  Next
                                </span>
                              ) : null}
                              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
                                {venue}
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink)]">
                              {event.title}
                            </h3>
                            <p className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                              <time dateTime={event.event_date ?? undefined}>
                                {formatEventDate(event.event_date)}
                              </time>
                            </p>
                          </div>

                          {event.event_url ? (
                            <a
                              href={event.event_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-[var(--harbor)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                              aria-label={`Open ${event.title} (opens in a new tab)`}
                            >
                              Open event
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ) : null}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </section>
          </ScrollReveal>
        )}

        {venues && venues.length > 0 && (
          <ScrollReveal>
            <section>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow="Radar"
                  title="Monitored venues"
                  description="Venue pages we watch for new listings."
                  className="mb-0"
                />
                <Link
                  href="/shows/new"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[var(--fog)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--harbor)] transition hover:border-[var(--harbor)]/35"
                >
                  Inbox
                  {totalUnseen > 0 ? (
                    <span className="rounded-md bg-[var(--signal)] px-2 py-0.5 text-xs font-bold text-white">
                      {totalUnseen}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[var(--ink-muted)]">clear</span>
                  )}
                </Link>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {venues.map((v: { id: string; name: string; url: string }) => {
                  const count = unseenByVenue.get(v.id) ?? 0;
                  return (
                    <a
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--fog)] bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--harbor)]/35 hover:shadow-sm"
                    >
                      {v.name}
                      {count > 0 ? (
                        <span className="rounded-md bg-[var(--harbor)] px-1.5 py-0.5 text-[11px] font-bold text-white tabular-nums">
                          {count}
                        </span>
                      ) : null}
                    </a>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section className="hidden md:block">
            <SectionHeader
              eyebrow="Spinning"
              title="On rotation"
              description="A few artists from the list — tap through to their show pages."
            />
            <ArtistRotator artists={myArtists} visibleCount={3} intervalMs={6000} />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="browse" className="scroll-mt-24">
            <SectionHeader
              eyebrow="Library"
              title="Browse"
              description="Artists you follow, local rooms, and shows already on the calendar."
            />
            <ShowTabs myArtists={myArtists} />
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
