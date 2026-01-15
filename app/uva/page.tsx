// app/uva/page.tsx
import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
export const dynamic = "force-dynamic";

const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

type ApiUvaGame = {
  id: string;
  opponent: string;
  date: string;
  location: "home" | "away" | "neutral";
  note?: string;
  sourceUrl?: string;
};

type UvaApiResponse = {
  updatedAt: string;
  games: ApiUvaGame[];
};

function fmtDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "TBD";
  return dt.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function LocationChip({ location }: { location: ApiUvaGame["location"] }) {
  if (location === "home")
    return (
      <span
        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
        style={{ background: UVA_BLUE, color: "white" }}
      >
        HOME
      </span>
    );

  if (location === "away")
    return (
      <span
        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
        style={{ background: UVA_ORANGE, color: "white" }}
      >
        AWAY
      </span>
    );

  return null;
}

export default async function UvaPage() {
  const baseUrl = await getBaseUrl();

  const { ok, data } = await safeFetch<UvaApiResponse>(
    `${baseUrl}/api/uva`,
    { cache: "no-store" }
  );

  if (!ok || !data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">UVA Basketball</h1>
          <p className="mt-4 text-sm text-slate-500">
            Upcoming games are temporarily unavailable.
          </p>
        </section>
      </main>
    );
  }

  const now = new Date();

  const upcoming = (data.games ?? [])
    .filter((g) => {
      const d = new Date(g.date);
      return !Number.isNaN(d.getTime()) && d > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${UVA_BLUE}11, ${UVA_ORANGE}11)` }}
    >
      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: UVA_BLUE }}
            >
              UVA Basketball
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Upcoming games
            </p>
          </div>

          <div
            className="flex h-14 w-14 items-center justify-center rounded-lg text-2xl font-bold shadow-md"
            style={{
              backgroundColor: UVA_BLUE,
              color: UVA_ORANGE,
              border: `3px solid ${UVA_ORANGE}`,
            }}
          >
            🏀
          </div>
        </div>
{/* 🔥 Scores banner */}
<div className="mb-6">
  <ScoresBanner />
</div>
        {/* Games Grid */}
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-600">No upcoming games found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>{fmtDate(g.date)}</span>
                      <LocationChip location={g.location} />
                    </div>

                    <div className="mt-1 text-base font-extrabold text-slate-900 truncate">
                      vs {g.opponent}
                    </div>

                    {g.note ? (
                      <div className="mt-1 text-xs text-slate-500">
                        {g.note}
                      </div>
                    ) : null}

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

                  <div className="grid place-items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    🏀
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}