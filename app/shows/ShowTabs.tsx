"use client";

import { useMemo, useState } from "react";
import EntityCard from "@/app/components/ui/EntityCard";
import FadeIn from "@/app/components/motion/FadeIn";
import type { MyArtist } from "@/app/data/myArtists";
import type { VenueRegion } from "@/app/data/localVenues";
import { localVenuesByRegion } from "@/app/data/localVenues";
import { myShows } from "@/app/data/myShows";

type Tab = "artists" | "venues" | "myshows";

type Props = {
  myArtists: MyArtist[];
  venuesByRegion?: VenueRegion[];
};

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-3 text-sm font-semibold transition-colors ${
        active
          ? "border-b-2 border-[var(--harbor)] text-[var(--ink)]"
          : "border-b-2 border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function formatShowDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ShowTabs({ myArtists, venuesByRegion }: Props) {
  const [tab, setTab] = useState<Tab>("myshows");

  const artists = useMemo(
    () => (Array.isArray(myArtists) ? myArtists : []),
    [myArtists]
  );

  const venueGroups = useMemo(() => {
    const v = venuesByRegion ?? localVenuesByRegion;
    return Array.isArray(v) ? v : [];
  }, [venuesByRegion]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const upcomingShows = useMemo(
    () =>
      [...myShows]
        .filter((s) => s.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [today]
  );

  const pastShows = useMemo(
    () =>
      [...myShows]
        .filter((s) => s.date < today)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [today]
  );

  const artistCount = artists.length;
  const venueCount = venueGroups.reduce((acc, g) => acc + (g.venues?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--fog)]">
        <div className="flex gap-5 sm:gap-6 overflow-x-auto">
          <TabButton active={tab === "myshows"} onClick={() => setTab("myshows")}>
            My Shows{" "}
            <span className="text-[var(--ink-muted)] font-medium">({upcomingShows.length})</span>
          </TabButton>

          <TabButton active={tab === "artists"} onClick={() => setTab("artists")}>
            Artists{" "}
            <span className="text-[var(--ink-muted)] font-medium">({artistCount})</span>
          </TabButton>

          <TabButton active={tab === "venues"} onClick={() => setTab("venues")}>
            Venues{" "}
            <span className="text-[var(--ink-muted)] font-medium">({venueCount})</span>
          </TabButton>
        </div>
      </div>

      {tab === "artists" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {artists.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-[var(--fog)] bg-white/90 p-5 text-sm text-[var(--ink-muted)]">
              Nothing to show yet.
            </div>
          ) : (
            artists.map((a, idx) => (
              <FadeIn key={a.url ?? a.name} delay={Math.min(idx * 0.03, 0.3)}>
                <EntityCard
                  title={a.name}
                  href={a.url ?? "#"}
                  imageSrc={a.image}
                  subtitle={a.url ? "Shows →" : "Add a link →"}
                />
              </FadeIn>
            ))
          )}
        </div>
      ) : tab === "myshows" ? (
        <div className="space-y-8">
          {upcomingShows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--fog)] bg-white/70 px-6 py-12 text-center">
              <p className="font-display text-xl font-semibold text-[var(--ink)]">No upcoming shows</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--ink-muted)]">
                When you add dates to your personal list, they&apos;ll show up here first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingShows.map((show, idx) => (
                <FadeIn key={`${show.artist}-${show.date}-${show.venue}`} delay={Math.min(idx * 0.04, 0.28)}>
                  <article className="rounded-2xl border border-[var(--fog)] bg-white/90 p-4 sm:p-5 transition hover:border-[var(--harbor)]/30 hover:shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex gap-4">
                        <div className="hidden sm:flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--paper)] ring-1 ring-[var(--fog)]">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--harbor)]">
                            {new Date(`${show.date}T12:00:00`).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </span>
                          <span className="font-display text-xl font-semibold text-[var(--ink)] leading-none">
                            {new Date(`${show.date}T12:00:00`).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-semibold text-[var(--ink)] truncate">
                            {show.artist}
                          </h3>
                          <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
                            {show.venue}
                            {show.location ? ` · ${show.location}` : ""}
                          </p>
                          <p className="mt-2 text-xs font-medium text-[var(--ink-muted)] sm:hidden">
                            {formatShowDate(show.date)}
                          </p>
                        </div>
                      </div>

                      {show.ticketUrl ? (
                        <a
                          href={show.ticketUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--harbor)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                        >
                          Tickets
                        </a>
                      ) : null}
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}

          {pastShows.length > 0 ? (
            <div>
              <p className="label-xs mb-3">Recently passed</p>
              <div className="space-y-2">
                {pastShows.slice(0, 6).map((show) => (
                  <div
                    key={`${show.artist}-${show.date}-past`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--fog)]/80 bg-white/50 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-[var(--ink)]">{show.artist}</span>
                      <span className="text-[var(--ink-muted)]"> · {show.venue}</span>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--ink-muted)]">
                      {formatShowDate(show.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-8">
          {venueGroups.length === 0 ? (
            <div className="rounded-2xl border border-[var(--fog)] bg-white/90 p-5 text-sm text-[var(--ink-muted)]">
              No venues configured yet.
            </div>
          ) : (
            venueGroups.map((group) => (
              <div key={group.region}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--harbor)]">
                  {group.region}
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(group.venues ?? []).map((v) => (
                    <EntityCard
                      key={v.url}
                      title={v.name}
                      href={v.url}
                      imageSrc={v.image}
                      subtitle="Upcoming shows →"
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
