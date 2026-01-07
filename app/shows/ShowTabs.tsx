"use client";

import { useMemo, useState } from "react";
import EntityCard from "@/app/components/ui/EntityCard";
import type { MyArtist } from "@/app/data/myArtists";
import type { VenueRegion } from "@/app/data/localVenues";
import { localVenuesByRegion } from "@/app/data/localVenues";
import { __debug_localVenuesByRegion_exists } from "@/app/data/localVenues";

type Tab = "artists" | "venues";

type Props = {
  myArtists: MyArtist[];
  // optional: if you ever want to pass venues in from page.tsx instead of importing
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
      className={`pb-3 text-sm font-semibold transition ${
        active
          ? "border-b-2 border-slate-900 text-slate-900"
          : "border-b-2 border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function ShowTabs({ myArtists, venuesByRegion }: Props) {
  const [tab, setTab] = useState<Tab>("artists");

  const artists = useMemo(
    () => (Array.isArray(myArtists) ? myArtists : []),
    [myArtists]
  );

  const venueGroups = useMemo(() => {
    const v = venuesByRegion ?? localVenuesByRegion;
    return Array.isArray(v) ? v : [];
  }, [venuesByRegion]);

  const artistCount = artists.length;
  const venueCount = venueGroups.reduce((acc, g) => acc + (g.venues?.length ?? 0), 0);

  return (
    <div className="mt-6 space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          <TabButton active={tab === "artists"} onClick={() => setTab("artists")}>
            My Artists <span className="text-slate-400">({artistCount})</span>
          </TabButton>

          <TabButton active={tab === "venues"} onClick={() => setTab("venues")}>
            Local Venues <span className="text-slate-400">({venueCount})</span>
          </TabButton>
        </div>
      </div>

      {/* Content */}
      {tab === "artists" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {artists.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Nothing to show yet.
            </div>
          ) : (
            artists.map((a) => (
              <EntityCard
                key={a.url ?? a.name}
                title={a.name}
                href={a.url ?? "#"}
                imageSrc={a.image}
                subtitle={a.url ? "Shows →" : "Add a link →"}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {venueGroups.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No venues configured yet.
            </div>
          ) : (
            venueGroups.map((group) => (
              <div key={group.region}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">
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