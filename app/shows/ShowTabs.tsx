"use client";

import { useState, type ReactNode } from "react";
import ConcertCard from "@/app/components/concerts/ConcertCard";
import type { Concert } from "@/lib/concerts/types";
import Link from "next/link";

type FollowingGroup = {
  artist: string;
  events: Concert[];
};

type Props = {
  nextEvents: Concert[];
  following: FollowingGroup[];
};

type Tab = "going" | "following" | "next";

export default function ShowTabs({ nextEvents, following }: Props) {
  const [tab, setTab] = useState<Tab>("following");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
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

      {/* Content */}
      {tab === "going" && (
  <Section>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Shows I’m going to
        </div>

        <div className="mt-2 text-lg font-bold text-slate-900">
          Badfish (Tribute to Sublime)
        </div>

        <div className="mt-1 text-sm text-slate-600">
          Norfolk • Jan 23
        </div>

        <div className="mt-4">
          <Link
            href="/shows/badfish"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white hover:border-slate-300"
          >
            Open details <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  </Section>
)}

      {tab === "following" && (
        <Section>
          {following.length === 0 ? (
            <Empty text="No followed artist events found." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {following.flatMap((g) =>
                g.events.map((c) => <ConcertCard key={c.id} concert={c} />)
              )}
            </div>
          )}
        </Section>
      )}

      {tab === "next" && (
        <Section>
          {nextEvents.length === 0 ? (
            <Empty text="No shows in the next 7 days." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nextEvents.map((c) => (
                <ConcertCard key={c.id} concert={c} />
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
        active
          ? "border-slate-900 text-slate-900"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <div className="min-h-[200px]">{children}</div>;
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-slate-500">{text}</div>;
}