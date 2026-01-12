"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

import TeamRoster from "@/app/components/TeamRoster";
import Schedule from "@/app/components/Schedule";
import TeamStats from "@/app/components/TeamStats";
import GameLocations from "@/app/components/GameLocations";

type Tab = "roster" | "schedule" | "stats" | "locations";

const TABS: { key: Tab; label: string }[] = [
  { key: "roster", label: "Roster" },
  { key: "schedule", label: "Schedule" },
  { key: "stats", label: "Stats" },
  { key: "locations", label: "Game locations" },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        inline-flex items-center
        rounded-full border border-white/25 bg-white/10
        px-3 py-1 text-xs text-white/90 backdrop-blur
        transition-all duration-200
        hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md
        hover:ring-1 hover:ring-white/40
        cursor-default
      "
    >
      {children}
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("roster");

  const content = useMemo(() => {
    if (activeTab === "roster") return <TeamRoster />;
    if (activeTab === "schedule") return <Schedule />;
    if (activeTab === "locations") return <GameLocations />;
    return <TeamStats />;
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[rgb(var(--ohms-paper,245_246_248))] text-slate-900">
      {/* HERO */}
      <header className="relative isolate overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          {/* Hero image */}
          <Image
            src="/images/ohbball.png"
            alt="OHMS Girls Basketball"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Darken + purple brand overlay so white text stays readable */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-purple-900/55 to-indigo-950/75" />

          {/* Glow accents (keep your polish) */}
          <div className="absolute -top-24 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 right-[-10rem] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {/* Left */}
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/15">
                Orchard House Middle School • Girls Basketball • Grades 5–8
              </p>

              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Extraordinary on the court
                <span className="block text-white/85">Gryphons all season</span>
              </h1>

              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/80 md:text-base">
                {/* (optional) add a line here if you want */}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip>Head Coach: Marti Kandl</Chip>
                <Chip>Assistant: Eddie Bagnell</Chip>
                <Chip>Athletics Director: Rebecca Reyes</Chip>
              </div>
            </div>

            {/* Right logo card */}
            <div className="w-full md:w-[22rem]">
              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-white p-2">
                    <Image
                      src="/images/gryphons.png"
                      alt="Gryphons Logo"
                      width={72}
                      height={72}
                      className="h-auto w-auto"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">OHMS Gryphons</p>
                    <p className="text-xs text-white/75">Girls Basketball</p>
                  </div>
                </div>

                {/* quick link that switches tab */}
                <div className="mt-4 rounded-xl bg-black/10 p-3 text-white/85">
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("schedule");
                        document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs bar */}
          <div className="mt-8 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => {
                const on = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-medium transition",
                      on ? "bg-white text-slate-900 shadow-sm" : "text-white/85 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main id="content" className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
         <section
  className="
    relative overflow-hidden rounded-2xl
    bg-white p-6 shadow-sm ring-1 ring-slate-200/70
  "
>
  {/* subtle purple wash like the hero */}
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />
    <div className="absolute -top-24 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-purple-200/30 blur-3xl" />
    <div className="absolute -bottom-24 right-[-8rem] h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />
  </div>

  {content}
</section>

          {/* Side rail */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                PRACTICE
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Practice Schedule: Mondays and Thursdays 4:00–5:30
              </p>
              <div className="mt-3 rounded-xl bg-[rgb(var(--ohms-paper,245_246_248))] p-3 text-xs text-slate-600">
                The Faison Center • 5311 Markel Road
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                TEAM UPDATE
              </p>

              <p className="mt-2 text-sm text-slate-700">
                The Gryphons had an incredible day at the University of Richmond Women’s
                Basketball Education Day!
              </p>

              <a
                href="https://www.youtube.com/watch?v=sdio-fLlRyk"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 block overflow-hidden rounded-xl ring-1 ring-slate-200 transition
                           hover:shadow-md hover:ring-purple-300"
              >
                <div className="relative">
                  <Image
                    src="/images/education-day.png"
                    alt="U of R Women's Basketball Education Day"
                    width={800}
                    height={450}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-purple-700 shadow">
                      ▶ Watch on YouTube
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-600">
          Go Gryphons! 🏀
        </div>
      </footer>
    </div>
  );
}