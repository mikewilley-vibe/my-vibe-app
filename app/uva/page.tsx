// app/uva/page.tsx

const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallbacks for local dev
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

type UvaGame = {
  sport: "football" | "basketball" | string;
  opponent: string;
  date: string;
  location: string;
  result: string;
  score?: string;
  note?: string;
  teamBadge?: string;
  teamLogo?: string;
  equipmentArt?: string;
};

type UvaApiResponse = {
  updatedAt: string;
  games: UvaGame[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function sportIcon(sport: string) {
  if (sport.toLowerCase() === "football") return "🏈";
  if (sport.toLowerCase() === "basketball") return "🏀";
  return "🎽";
}

function resultBadge(result: string) {
  const r = result.toLowerCase();

  if (r === "win") {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#E6F4EA", color: "#0F8A3B" }}>
        WIN
      </span>
    );
  }
  if (r === "loss") {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#FCE8E6", color: "#D93025" }}>
        LOSS
      </span>
    );
  }

  return (
    <span className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: "#FFF4D6", color: "#B15C00" }}>
      PENDING
    </span>
  );
}

function computeRecord(games: UvaGame[]) {
  let wins = 0, losses = 0, pending = 0;
  for (const g of games) {
    const r = g.result.toLowerCase();
    if (r === "win") wins++;
    else if (r === "loss") losses++;
    else pending++;
  }
  return { wins, losses, pending };
}

function RecordPill({
  label,
  wins,
  losses,
  pending,
}: {
  label: string;
  wins: number;
  losses: number;
  pending: number;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm border"
      style={{
        backgroundColor: "white",
        borderColor: UVA_BLUE + "33",
      }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: UVA_BLUE }}
      >
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color: UVA_ORANGE }}>
        {wins}-{losses}
      </span>
      {pending > 0 && (
        <span className="text-[11px]" style={{ color: UVA_BLUE }}>
          ({pending} pending)
        </span>
      )}
    </div>
  );
}

function GameCard({ game }: { game: UvaGame }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border"
      style={{
        backgroundColor: "white",
        borderColor: UVA_BLUE + "33",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold"
          style={{ backgroundColor: UVA_BLUE, color: "white" }}
        >
          {sportIcon(game.sport)}
        </div>

        <div>
          <div
            className="text-[11px] font-semibold uppercase tracking-wide flex gap-2"
            style={{ color: UVA_BLUE }}
          >
            <span>{game.sport}</span>•<span>{game.location.toUpperCase()}</span>
          </div>

          <div
            className="mt-1 text-sm font-semibold"
            style={{ color: UVA_BLUE }}
          >
            vs {game.opponent}
          </div>

          <div className="text-xs text-slate-500">{formatDate(game.date)}</div>

          {game.note && (
            <div className="mt-1 text-xs text-slate-500">{game.note}</div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {game.score && (
          <div
            className="text-sm font-bold"
            style={{ color: UVA_ORANGE }}
          >
            {game.score}
          </div>
        )}
        {resultBadge(game.result)}
      </div>
    </div>
  );
}

export default async function UvaPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/uva`, { cache: "no-store" });

  if (!res.ok) {
    // optional: fail gracefully instead of hard-crashing
    throw new Error("Failed to load UVA data");
  }

  const data = (await res.json()) as UvaApiResponse;
  const games = data.games;
  // ...everything else stays the same

  const now = new Date();
  const pastGames = games
    .filter((g) => new Date(g.date) <= now || g.result !== "pending")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcoming = games
    .filter((g) => new Date(g.date) > now && g.result === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recent = pastGames;
  const next = upcoming;


  const overall = computeRecord(games);
  const fb = computeRecord(games.filter((g) => g.sport === "football"));
  const bb = computeRecord(games.filter((g) => g.sport === "basketball"));

  const updatedAt = new Date(data.updatedAt);

  return (
    <main
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${UVA_BLUE}11, ${UVA_ORANGE}11)`,
      }}
    >
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: UVA_BLUE }}
            >
              UVA Scoreboard
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

          {/* Shield-style UVA badge */}
          <div
            className="h-16 w-16 rounded-lg flex items-center justify-center text-3xl font-bold shadow-md"
            style={{
              backgroundColor: UVA_BLUE,
              color: UVA_ORANGE,
              border: `3px solid ${UVA_ORANGE}`,
            }}
          >
            V⚔️
          </div>
        </div>

        {/* Record Bar */}
        <div
          className="rounded-2xl p-4 mb-10"
          style={{
            background: `linear-gradient(90deg, ${UVA_BLUE}22, ${UVA_ORANGE}22)`,
            border: `1px solid ${UVA_BLUE}33`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: UVA_BLUE }}
          >
            Season Record
          </p>

          <div className="flex flex-wrap gap-3">
            <RecordPill label="Football" {...fb} />
            <RecordPill label="Basketball" {...bb} />
          </div>
        </div>

        {/* Two columns */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Recent */}
          <div>
            <h2
              className="text-sm font-semibold uppercase tracking-wide mb-3"
              style={{ color: UVA_BLUE }}
            >
              Recent Games
            </h2>

            {recent.length === 0 ? (
              <p className="text-sm text-slate-600">No games yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.map((g, i) => (
                  <GameCard key={i} game={g} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div>
            <h2
              className="text-sm font-semibold uppercase tracking-wide mb-3"
              style={{ color: UVA_BLUE }}
            >
              Upcoming Games
            </h2>

            {next.length === 0 ? (
              <p className="text-sm text-slate-600">No upcoming games.</p>
            ) : (
              <div className="space-y-3">
                {next.map((g, i) => (
                  <GameCard key={i} game={g} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}