import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import UvaTabs from "@/app/components/uva/UvaTabs";
import UvaPageHeader from "@/app/components/uva/UvaPageHeader";
import { UVA_BLUE, UVA_ORANGE, uvaPageBg } from "@/app/components/uva/uvaTheme";

export const dynamic = "force-dynamic";

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
        className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ backgroundColor: UVA_BLUE }}
      >
        HOME
      </span>
    );

  if (location === "away")
    return (
      <span
        className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ backgroundColor: UVA_ORANGE }}
      >
        AWAY
      </span>
    );

  return null;
}

export default async function UvaPage() {
  const baseUrl = await getBaseUrl();
  const apiUrl = `${baseUrl}/api/uva`;

  const { ok, data, error } = await safeFetch<UvaApiResponse>(apiUrl, {
    cache: "no-store",
  });

  if (!ok || !data) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <UvaTabs />
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 sm:p-8">
            <h1 className="font-display text-3xl font-semibold" style={{ color: UVA_BLUE }}>
              UVA Basketball
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              Upcoming games are temporarily unavailable. Please try again in a few minutes.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-white/80 px-3 py-2 font-mono text-xs text-rose-700">
                {error || "Unknown fetch error"}
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  const now = new Date();

  const upcoming = (data.games ?? [])
    .filter((g) => {
      const d = new Date(g.date);
      return !Number.isNaN(d.getTime()) && d > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextGame = upcoming[0];

  return (
    <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <UvaTabs />

        <UvaPageHeader
          eyebrow="Athletics"
          title="UVA Basketball"
          description={
            nextGame
              ? `Next up: vs ${nextGame.opponent} · ${fmtDate(nextGame.date)}`
              : "Upcoming Cavaliers games"
          }
        />

        <div className="mb-8">
          <ScoresBanner />
        </div>

        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: UVA_ORANGE }}>
              Schedule
            </p>
            <h2 className="font-display text-2xl font-semibold" style={{ color: UVA_BLUE }}>
              Upcoming games
            </h2>
          </div>
          <span className="text-sm text-slate-600 tabular-nums">{upcoming.length} listed</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
            No upcoming games found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((g, idx) => (
              <article
                key={g.id}
                className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                      {idx === 0 ? (
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                          style={{ backgroundColor: UVA_ORANGE }}
                        >
                          Next
                        </span>
                      ) : null}
                      <span>{fmtDate(g.date)}</span>
                      <LocationChip location={g.location} />
                    </div>

                    <h3 className="mt-2 truncate font-display text-xl font-semibold text-slate-900">
                      vs {g.opponent}
                    </h3>

                    {g.note ? <p className="mt-1 text-xs text-slate-500">{g.note}</p> : null}

                    {g.sourceUrl ? (
                      <a
                        href={g.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-xs font-semibold hover:underline"
                        style={{ color: UVA_ORANGE }}
                      >
                        Game details →
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
