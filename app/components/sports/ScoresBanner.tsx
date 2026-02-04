// app/components/scores/ScoresBanner.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import FadeIn from "@/app/components/motion/FadeIn";

type ScoreStatus = "scheduled" | "live" | "final";

type ScoreGame = {
  id: string;
  league: "NFL" | "NCAAF" | "NCAAM";
  name: string;
  home: string;
  away: string;
  startTime: string;
  status: ScoreStatus;
  homeScore?: number;
  awayScore?: number;
  detail?: string;

  // added from API
  homeLogo?: string;
  awayLogo?: string;
  gamecastUrl?: string;
};

function badgeForLeague(lg: ScoreGame["league"]) {
  if (lg === "NFL") return "🏈 NFL";
  if (lg === "NCAAF") return "🏈 NCAAF";
  return "🏀 NCAAM";
}

function statusPill(status: ScoreStatus) {
  if (status === "live")
    return { text: "LIVE", cls: "bg-red-100 text-red-700 border-red-200" };
  if (status === "final")
    return { text: "FINAL", cls: "bg-slate-100 text-slate-700 border-slate-200" };
  return { text: "UP NEXT", cls: "bg-blue-100 text-blue-700 border-blue-200" };
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function norm(s: string) {
  return (s ?? "").toLowerCase();
}

function isUvaGame(g: ScoreGame) {
  // UVA aliases: "Virginia", "UVA", "Cavaliers"
  const hay = `${g.home} ${g.away} ${g.name}`.toLowerCase();
  return hay.includes("virginia") || hay.includes("uva") || hay.includes("cavaliers");
}

function uniqById(games: ScoreGame[]) {
  const m = new Map<string, ScoreGame>();
  games.forEach((g) => m.set(g.id, g));
  return Array.from(m.values());
}

function TeamLogo({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="h-6 w-6 rounded-full border border-slate-200 bg-white"
      />
    );
  }

  return (
    <div className="relative h-6 w-6 overflow-hidden rounded-full border border-slate-200 bg-white">
      <Image src={src} alt={alt} fill sizes="24px" className="object-contain p-0.5" />
    </div>
  );
}

export default function ScoresBanner({
  className,
  limit = 8,
}: {
  className?: string;
  limit?: number;
}) {
  const [games, setGames] = useState<ScoreGame[] | null>(null);
  const [preset, setPreset] = useState<"live" | "nfl" | "ncaa">("live");
const [date, setDate] = useState<string>(""); // YYYY-MM-DD (optional override)
  const [dateOverride, setDateOverride] = useState<string>("");
const today = new Date().toISOString().slice(0, 10);

useEffect(() => {
  let cancelled = false;

  async function load() {
    // ✅ BUILD REQUEST URL FROM STATE (THIS IS THE ANSWER)
    const params = new URLSearchParams();
    params.set("preset", preset);

    if (date) {
      params.set("date", date);
    }

    const url = `/api/scores?${params.toString()}`;

    try {
      const r = await fetch(url, { cache: "no-store" });
      const data = await r.json();
      if (!cancelled) setGames(data.games ?? []);
    } catch {
      if (!cancelled) setGames([]);
    }
  }

  load();
  const t = setInterval(load, 30_000);

  return () => {
    cancelled = true;
    clearInterval(t);
  };
}, [preset, date]);

  const top = useMemo(() => {
  const list: ScoreGame[] = games ?? [];

  const uva = list.filter(
    (g) =>
      (g.league === "NCAAM" || g.league === "NCAAF") &&
      isUvaGame(g)
  );

  const nonUva = list.filter(
    (g) =>
      !(
        (g.league === "NCAAM" || g.league === "NCAAF") &&
        isUvaGame(g)
      )
  );

  // keep UVA pinned (max 4), then fill remaining slots with others
  const pinnedUva = uniqById(uva).slice(0, 4);
  const rest = uniqById(nonUva);

  return uniqById([...pinnedUva, ...rest]).slice(0, limit);
}, [games, limit]);

  if (games === null) return null;
  if (games.length === 0) return null;

  return (
    <FadeIn>
      <section
        className={[
          "rounded-2xl border border-slate-200 bg-white shadow-sm",
          "px-4 py-2", // thinner
          className ?? "",
        ].join(" ")}
      >
        <div className="mt-2 flex flex-wrap items-center gap-2">
<button
  className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-slate-50"
  onClick={() => {
    setPreset("live");
    setDate("");
  }}
>
  Live
</button>

<button
  className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-slate-50"
  onClick={() => {
    setPreset("nfl");   // ✅ matches API
    setDate("");        // let server choose next Sunday
  }}
>
  NFL Sunday
</button>

<button
  className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-slate-50"
  onClick={() => {
    setPreset("ncaa");  // ✅ matches API
    setDate("");        // or set a date if you want
  }}
>
  NCAA
</button>

<input
  value={date}
  onChange={(e) => setDate(e.target.value)}
  placeholder="YYYY-MM-DD"
  className="h-8 w-32 rounded-lg border px-2 text-xs"
 />
</div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {top.map((g) => {
            const pill = statusPill(g.status);
            const hs = g.homeScore ?? 0;
            const as = g.awayScore ?? 0;

            const href =
              g.gamecastUrl ??
              (g.league === "NFL"
                ? `https://www.espn.com/nfl/game/_/gameId/${g.id}`
                : g.league === "NCAAF"
                ? `https://www.espn.com/college-football/game/_/gameId/${g.id}`
                : `https://www.espn.com/mens-college-basketball/game/_/gameId/${g.id}`);

            return (
              <a
                key={g.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={[
                  "min-w-[260px] rounded-xl border border-slate-200 bg-slate-50",
                  "px-3 py-2",
                  "transition",
                  "hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                ].join(" ")}
                title="Open ESPN Gamecast"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {badgeForLeague(g.league)}
                  </span>

                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                      pill.cls,
                    ].join(" ")}
                  >
                    {g.status === "live" ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        {pill.text}
                      </span>
                    ) : (
                      pill.text
                    )}
                  </span>
                </div>

<div className="mt-2 space-y-1">
  {/* Away */}
  <div className="flex items-center justify-between gap-2">
    <div className="flex min-w-0 items-center gap-2">
      <TeamLogo src={g.awayLogo} alt={`${g.away} logo`} />
      <div className="truncate text-sm font-semibold text-slate-900">
        {g.away}
      </div>
    </div>

    {g.status !== "scheduled" ? (
      <div className="text-sm font-semibold tabular-nums text-slate-900">
        {as}
      </div>
    ) : null}
  </div>

  {/* Home */}
  <div className="flex items-center justify-between gap-2">
    <div className="flex min-w-0 items-center gap-2">
      <div className="truncate text-sm font-bold text-slate-900"></div>
      <TeamLogo src={g.homeLogo} alt={`${g.home} logo`} />
      <div className="truncate text-sm font-semibold text-slate-900">
        {g.home}
      </div>
    </div>

    {g.status !== "scheduled" ? (
      <div className="text-sm font-semibold tabular-nums text-slate-900">
        {hs}
      </div>
    ) : null}
  </div>
</div>

                <div className="mt-1 text-xs text-slate-600">
                  {g.detail ?? (g.status === "scheduled" ? fmtTime(g.startTime) : "")}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </FadeIn>
  );
}