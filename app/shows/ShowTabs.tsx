"use client";

import { useMemo, useState } from "react";
import type { Concert } from "@/lib/concerts/types";

type Tab = "myArtists" | "local";

type Props = {
  myArtists: Concert[];
  local: Concert[];
};

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

function fmtNice(raw?: string) {
  if (!raw) return "TBD";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "TBD";

  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventRow({ e }: { e: Concert }) {
  // ✅ handle multiple possible fields, but prefer dateTime
  const rawDate =
    (e as any)?.dateTime ||
    (e as any)?.dates?.start?.dateTime ||
    (e as any)?.dates?.start?.localDate ||
    (e as any)?.date ||
    (e as any)?.dateIso ||
    "";

  const nice = fmtNice(rawDate);

  const venue = (e as any)?.venue ?? "";
  const city = (e as any)?.city ?? "";
  const state = (e as any)?.state ?? "";

  const where = [venue, [city, state].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" • ");

  const line = [nice, where].filter(Boolean).join(" • ");

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
            {(e as any)?.name ?? "Untitled"}
          </div>

          <div className="mt-1 text-xs text-slate-600">{line || "TBD"}</div>

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

export default function ShowTabs({ myArtists, local }: Props) {
  const myArtistsSafe = Array.isArray(myArtists) ? myArtists : [];
  const localSafe = Array.isArray(local) ? local : [];

  const [tab, setTab] = useState<Tab>("local");
  const [venueFilter, setVenueFilter] = useState<string>("");

  const filteredLocal = useMemo(() => {
    if (!venueFilter) return localSafe;
    const want = norm(venueFilter);
    return localSafe.filter((e) => norm(e.venue) === want);
  }, [localSafe, venueFilter]);

  const list = tab === "myArtists" ? myArtistsSafe : filteredLocal;

  const counts = {
    myArtists: myArtistsSafe.length,
    localAll: localSafe.length,
    localFiltered: filteredLocal.length,
  };

  const emptyText =
    tab === "myArtists"
      ? "No upcoming shows found for your saved artists."
      : venueFilter
      ? `No shows found for ${venueFilter} in the next 30 days.`
      : "No local shows found in the next 30 days.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200">
        <div className="flex gap-6">
          <TabButton active={tab === "myArtists"} onClick={() => setTab("myArtists")}>
            My Artists <span className="text-slate-400">({counts.myArtists})</span>
          </TabButton>

          <TabButton active={tab === "local"} onClick={() => setTab("local")}>
            Local Venues <span className="text-slate-400">({venueFilter ? counts.localFiltered : counts.localAll})</span>
          </TabButton>
        </div>

        {tab === "local" ? (
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
              {FEATURED_VENUES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {list.length ? (
        <div className="space-y-3">
          {list.map((e) => (
            <EventRow key={e.id} e={e} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">{emptyText}</p>
      )}
    </div>
  );
}