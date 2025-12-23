// app/uva/page.tsx
import { getBaseUrl } from "@/lib/baseUrl";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import { safeFetch } from "@/lib/safeFetch";

const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

type ApiUvaGame = {
  id?: string;
  sport?: string;

  date?: string;
  startTime?: string;

  opponent?: string;
  location?: string;

  home?: string;
  away?: string;

  note?: string;
  sourceUrl?: string;
};

type UvaApiResponse = {
  updatedAt: string;
  games: ApiUvaGame[];
};

function isBasketballSport(sport: unknown) {
  return String(sport ?? "").toLowerCase().includes("basketball");
}

function getGameDate(g: ApiUvaGame): Date | null {
  const raw = (g.date ?? g.startTime ?? "").toString().trim();
  if (!raw) return null;
  if (raw.toLowerCase().includes("tbd")) return null;

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function gameTitle(g: ApiUvaGame) {
  if (g.opponent) {
    return `vs ${String(g.opponent)
      .replace(/^vs\.?\s+/i, "")
      .replace(/^at\s+/i, "")
      .trim()}`;
  }
  if (g.away || g.home) return `${g.away ?? "TBD"} @ ${g.home ?? "TBD"}`;
  return "Opponent TBA";
}

function locationChip(g: ApiUvaGame) {
  const l = String(g.location ?? "").toLowerCase();
  if (l === "home") return "HOME";
  if (l === "away") return "AWAY";
  return "";
}

function fmtDate(d: Date | null) {
  if (!d) return "TBD";
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

function GameList({
  title,
  games,
  emptyText,
}: {
  title: string;
  games: ApiUvaGame[];
  emptyText: string;
}) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: UVA_BLUE }}>
        {title}
      </h2>

      {games.length === 0 ? (
        <p className="text-sm text-slate-600">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {games.map((g, idx) => {
            const d = getGameDate(g);
            const chip = locationChip(g);

            return (
              <div
                key={g.id ?? `${title}-${idx}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {fmtDate(d)}
                      {chip ? ` • ${chip}` : ""}
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">{gameTitle(g)}</div>

                    {g.note ? <div className="mt-1 text-xs text-slate-500">{g.note}</div> : null}

                    {g.sourceUrl ? (
                      <a
                        href={g.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Game details →
                      </a>
                    ) : null}
                  </div>

                  <div className="text-xl">🏀</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function UvaPage() {
  const baseUrl = await getBaseUrl();
const { data: uvaData, ok } = await safeFetch<UvaApiResponse>(
  `${baseUrl}/api/uva`,
  { cache: "no-store" }
);

if (!ok || !uvaData) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">UVA</h1>
        <p className="mt-4 text-sm text-slate-500">
          UVA data is temporarily unavailable.
        </p>
      </section>
    </main>
  );
}

 const updatedAt = new Date(uvaData.updatedAt);
const all = uvaData.games ?? [];

  // 1) Try basketball filter...
  const basketball = all.filter((g) => isBasketballSport(g.sport));

  // 2) ...but if that yields 0, fall back to showing whatever we got
  const pool = basketball.length > 0 ? basketball : all;

  const now = new Date();
  const withDates = pool.map((g) => ({ g, d: getGameDate(g) }));

  // Past = only games with a real date <= now
  const past = withDates
    .filter((x) => x.d && x.d <= now)
    .sort((a, b) => b.d!.getTime() - a.d!.getTime())
    .map((x) => x.g)
    .slice(0, 5);

  // Upcoming = future-dated games PLUS TBD/unknown dates (TBD last)
  const upcoming = withDates
    .filter((x) => !x.d || x.d > now) // <-- keeps TBD
    .sort((a, b) => {
      if (!a.d && !b.d) return 0;
      if (!a.d) return 1; // TBD last
      if (!b.d) return -1;
      return a.d.getTime() - b.d.getTime();
    })
    .map((x) => x.g)
    .slice(0, 5);

  return (
    <main
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${UVA_BLUE}11, ${UVA_ORANGE}11)` }}
    >
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: UVA_BLUE }}>
              UVA Basketball
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              Last updated{" "}
              {updatedAt.toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg text-3xl font-bold shadow-md"
            style={{
              backgroundColor: UVA_BLUE,
              color: UVA_ORANGE,
              border: `3px solid ${UVA_ORANGE}`,
            }}
          >
            V⚔️
          </div>
        </div>
<div className="mb-6">
  <ScoresBanner />
</div>
        <TwoColumnSection className="gap-10">
          <GameList title="Recent Games" games={past} emptyText="No recent games yet." />
          <GameList title="Upcoming Games" games={upcoming} emptyText="No upcoming games." />
        </TwoColumnSection>
      </section>
    </main>
  );
}