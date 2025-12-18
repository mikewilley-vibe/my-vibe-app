// app/components/UvaNextGames.tsx

type Props = {
  count?: number;
};

type UvaGame = {
  id: string;
  sport: string;
  opponent: string;
  date: string;
  location: string;
  note?: string;
  sourceUrl?: string;
};

type UvaApiResponse = {
  updatedAt: string;
  games: UvaGame[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

function cleanOpponent(opponent: string) {
  return (opponent || "Opponent TBA")
    .replace(/^vs\.?\s+/i, "")
    .replace(/^at\s+/i, "")
    .trim();
}

function locationLabel(loc: string) {
  const l = (loc || "").toLowerCase();
  if (l === "home") return "HOME";
  if (l === "away") return "AWAY";
  return ""; // don’t show neutral/unknown
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export default async function UvaNextGames({ count = 2 }: Props) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/uva`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <div className="rounded-2xl border bg-white p-4 text-sm text-slate-600">
        UVA: couldn’t load schedule right now.
      </div>
    );
  }

  const data = (await res.json()) as UvaApiResponse;

  const now = new Date();
  const upcoming = (data.games || [])
    .filter((g) => (g.sport || "").toLowerCase() === "basketball")
    .filter((g) => new Date(g.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Next UVA Games
        </h2>
        <a
          href="/uva"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Full schedule →
        </a>
      </div>

      {upcoming.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">No upcoming games found.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {upcoming.map((g) => (
            <div key={g.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    {formatDate(g.date)}
                    {locationLabel(g.location) ? ` • ${locationLabel(g.location)}` : ""}
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    vs {cleanOpponent(g.opponent)}
                  </div>

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
          ))}
        </div>
      )}
    </section>
  );
}