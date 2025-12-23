"use client";

import { useMemo, useState } from "react";
import type { Concert } from "@/lib/concerts/types";

type Tab = "going" | "following" | "next";

type FollowingGroup = { artist: string; events: Concert[] };

type Props = {
  nextEvents: Concert[];
  following: FollowingGroup[];
  // optional if you add later:
  goingEvents?: Concert[];
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
  const dt = e?.dateTime ? new Date(e.dateTime) : null;
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

  return (
    <a
      href={e.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">{e.name}</div>
          <div className="mt-1 text-xs text-slate-600">
            {nice} • {e.venue} • {e.city}
            {e.state ? `, ${e.state}` : ""}
          </div>
          {typeof e.priceMin === "number" ? (
            <div className="mt-1 text-xs text-slate-500">
              ${e.priceMin.toFixed(2)}
              {typeof e.priceMax === "number" && e.priceMax !== e.priceMin
                ? ` – $${e.priceMax.toFixed(2)}`
                : ""}
            </div>
          ) : null}
        </div>

        {e.image ? (
          <img
            src={e.image}
            alt=""
            className="h-14 w-20 rounded-lg object-cover border border-slate-200"
          />
        ) : null}
      </div>
    </a>
  );
}

export default function ShowTabs({ nextEvents, following, goingEvents = [] }: Props) {
  // ✅ hooks INSIDE component
  const [tab, setTab] = useState<Tab>("next"); // default to Next 7 Days

  const flatFollowing = useMemo(() => {
    return (following ?? []).flatMap((g) => g.events ?? []);
  }, [following]);

  const list =
    tab === "next" ? nextEvents : tab === "following" ? flatFollowing : goingEvents;

  const emptyText =
    tab === "next"
      ? "No events found in the next 7 days."
      : tab === "following"
      ? "No followed artist events found."
      : "No saved shows yet.";

  return (
    <div className="space-y-4">
      <div className="flex gap-6 border-b border-slate-200">
        <TabButton active={tab === "going"} onClick={() => setTab("going")}>
          Shows I’m Going To
        </TabButton>
        <TabButton active={tab === "following"} onClick={() => setTab("following")}>
          Artists I Follow
        </TabButton>
        <TabButton active={tab === "next"} onClick={() => setTab("next")}>
          Next 7 Days
        </TabButton>
      </div>

      {list?.length ? (
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