// app/components/UvaGameCard.tsx
const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

export type UvaGame = {
  id: string;
  sport?: string;
  opponent: string;
  date: string;
  location: string;
  score?: string;
  note?: string;
  sourceUrl?: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function cleanOpponent(opponent: string) {
  return (opponent || "Opponent TBA")
    .replace(/^vs\.?\s+/i, "")
    .replace(/^at\s+/i, "")
    .trim();
}

function cleanLocationLabel(loc: string) {
  const l = (loc || "").toLowerCase();
  if (l === "home") return "HOME";
  if (l === "away") return "AWAY";
  // if it's "neutral" or anything else, just don't show it
  return "";
}

export default function UvaGameCard({ game }: { game: UvaGame }) {
  const opp = cleanOpponent(game.opponent);
  const loc = cleanLocationLabel(String(game.location));

  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border"
      style={{ backgroundColor: "white", borderColor: UVA_BLUE + "33" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold"
          style={{ backgroundColor: UVA_BLUE, color: "white" }}
        >
          🏀
        </div>

        <div>
          <div
            className="text-[11px] font-semibold uppercase tracking-wide flex gap-2"
            style={{ color: UVA_BLUE }}
          >
            <span>basketball</span>
            {loc ? <span>•</span> : null}
            {loc ? <span>{loc}</span> : null}
          </div>

          <div className="mt-1 text-sm font-semibold" style={{ color: UVA_BLUE }}>
            vs {opp}
          </div>

          <div className="text-xs text-slate-500">{formatDate(game.date)}</div>

          {game.sourceUrl && (
            <a
              href={game.sourceUrl}
              className="mt-1 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noreferrer"
            >
              Game details →
            </a>
          )}

          {game.note && <div className="mt-1 text-xs text-slate-500">{game.note}</div>}
        </div>
      </div>

      {game.score ? (
        <div className="text-sm font-bold" style={{ color: UVA_ORANGE }}>
          {game.score}
        </div>
      ) : null}
    </div>
  );
}