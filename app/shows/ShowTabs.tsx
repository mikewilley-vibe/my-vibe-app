"use client";

import { useMemo, useState } from "react";
import type { Concert } from "@/lib/concerts/types";

type Tab = "myArtists" | "local";

type Props = {
  myArtists: Concert[];
  local: Concert[];
};

// Optional: keep a “top” section of venues you care about
const FEATURED_VENUES = [
  "The Annex",
  "The Broadberry",
  "The Norva",
  "The National",
  "The Dome",
  "The Allianz Ampitheater",
];

function norm(s: any) {
  return String(s ?? "").trim().toLowerCase();
}

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
      className={`px-3 py-2 text-sm font-semibold border-b-2 ${
        active
          ? "border-slate-900 text-slate-900"
          : "border-transparent text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function EventRow({ e }: { e: Concert }) {
  const rawDate = (e as any)?.dateTime ?? "";
  const dt = rawDate ? new Date(rawDate) : null;

  const nice =
    dt && !Number.isNaN(dt.getTime())
      ? dt.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "TBD";

  const venue = (e as any)?.venue ?? "";
  const city = (e as any)?.city ?? "";
  const state = (e as any)?.state ?? "";

  const where = [venue, [city, state].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" • ");

  return (
    <a
      href={(e as any)?.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {(e as any)?.name}
          </div>

          <div className="mt-1 text-xs text-slate-600">
            {nice}
            {where ? ` • ${where}` : ""}
          </div>

          {typeof (e as any)?.priceMin === "number" ? (
            <div className="mt-1 text-xs text-slate-500">
              ${(e as any).priceMin.toFixed(2)}
              {typeof (e as any)?.priceMax === "number" &&
              (e as any).priceMax !== (e as any).priceMin
                ? ` – $${(e as any).priceMax.toFixed(2)}`
                : ""}
            </div>
          ) : null}
        </div>

        {(e as any)?.image ? (
          <img
            src={(e as any).image}
            alt=""
            className="h-14 w-20 rounded-lg object-cover border border-slate-200"
          />
        ) : null}
      </div>
    </a>
  );
}

function uniqueSorted(values: string[]) {
  const set = new Map<string, string>(); // norm -> original
  for (const v of values) {
    const clean = String(v ?? "").trim();
    if (!clean) continue;
    const key = norm(clean);
    if (!set.has(key)) set.set(key, clean);
  }
  return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
}

export default function ShowTabs({ myArtists, local }: Props) {
  const myArtistsSafe = Array.isArray(myArtists) ? myArtists : [];
  const localSafe = Array.isArray(local) ? local : [];

  const [tab, setTab] = useState<Tab>("local");

  // dropdown selections
  const [artistFilter, setArtistFilter] = useState<string>("");
  const [venueFilter, setVenueFilter] = useState<string>("");

  // Build dropdown options
  const artistOptions = useMemo(() => {
    // We don’t have a clean “artist” field; best proxy is the “keyword match”
    // so use event.name as the option list (good enough for now).
    // If later you add (e as any).artist, swap this to that.
    return uniqueSorted(myArtistsSafe.map((e: any) => e?.name).filter(Boolean));
  }, [myArtistsSafe]);

  const venueOptions = useMemo(() => {
    const all = uniqueSorted(localSafe.map((e: any) => e?.venue).filter(Boolean));
    // Put featured at top if they exist in all
    const featuredNorm = new Set(FEATURED_VENUES.map(norm));
    const featured = all.filter((v) => featuredNorm.has(norm(v)));
    const rest = all.filter((v) => !featuredNorm.has(norm(v)));
    return [...featured, ...rest];
  }, [localSafe]);

  // Apply filters
  const filteredMyArtists = useMemo(() => {
    if (!artistFilter) return myArtistsSafe;
    const want = norm(artistFilter);
    return myArtistsSafe.filter((e: any) => norm(e?.name) === want);
  }, [myArtistsSafe, artistFilter]);

  const filteredLocal = useMemo(() => {
    if (!venueFilter) return localSafe;
    const want = norm(venueFilter);
    return localSafe.filter((e: any) => norm(e?.venue) === want);
  }, [localSafe, venueFilter]);

  const counts = {
    myArtistsAll: myArtistsSafe.length,
    myArtistsFiltered: filteredMyArtists.length,
    localAll: localSafe.length,
    localFiltered: filteredLocal.length,
  };

  const list = tab === "myArtists" ? filteredMyArtists : filteredLocal;

  const emptyText =
    tab === "myArtists"
      ? artistFilter
        ? `No shows found for ${artistFilter}.`
        : "No upcoming shows found for your saved artists."
      : venueFilter
      ? `No shows found for ${venueFilter} in the next 30 days.`
      : "No local shows found in the next 30 days.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200">
        <div className="flex gap-6">
          <TabButton active={tab === "myArtists"} onClick={() => setTab("myArtists")}>
            My Artists{" "}
            <span className="text-slate-400">
              ({artistFilter ? counts.myArtistsFiltered : counts.myArtistsAll})
            </span>
          </TabButton>

          <TabButton active={tab === "local"} onClick={() => setTab("local")}>
            Local Venues{" "}
            <span className="text-slate-400">
              ({venueFilter ? counts.localFiltered : counts.localAll})
            </span>
          </TabButton>
        </div>

        {/* Right-side dropdown changes based on active tab */}
        {tab === "myArtists" ? (
          <div className="pb-2">
            <label className="sr-only" htmlFor="artistFilter">
              Filter artist
            </label>
            <select
              id="artistFilter"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              <option value="">All my artists (1000 mi)</option>
              {artistOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="pb-2">
            <label className="sr-only" htmlFor="venueFilter">
              Filter venue
            </label>
            <select
              id="venueFilter"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              <option value="">All local venues (120 mi)</option>
              {venueOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* List */}
      {list.length ? (
        <div className="space-y-3">
          {list.map((e) => (
            <EventRow key={(e as any).id} e={e} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">{emptyText}</p>
      )}
    </div>
  );
}