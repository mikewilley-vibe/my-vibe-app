// app/components/Schedule.tsx
import { Calendar, MapPin, Trophy, Shirt, ChevronRight } from "lucide-react";

interface Game {
  id: number;
  date: string; // e.g. "Sat 1/10"
  time: string; // e.g. "2:30 PM"
  opponent: string;
  location: string; // "Home" | "Away" (keep if you want)
  venue: string;
  isHome: boolean;

  // ✅ new
  jersey?: "Purple" | "White" | "Black" | "Gold" | "Navy" | "Gray";
  directionsUrl?: string;

  result?: { score: string; won: boolean };
}

const games: Game[] = [
  {
    id: 1,
    date: "Sat 12/13",
    time: "6:00 PM",
    opponent: "St Bridget's",
    location: "Home",
    venue: "Benedictine",
    isHome: true,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Benedictine+College+Prep+Richmond+VA",
    result: { score: "22-15", won: true },
  },
  {
    id: 2,
    date: "Tue 12/16",
    time: "5:00 PM",
    opponent: "Our Lady of Lourdes",
    location: "Away",
    venue: "Our Lady of Lourdes",
    isHome: false,
    jersey: "White",
    directionsUrl: "https://maps.google.com/?q=Our+Lady+of+Lourdes+Catholic+School+Richmond+VA",
    result: { score: "12-11", won: false },
  },
  {
    id: 3,
    date: "Sat 1/10",
    time: "2:30 PM",
    opponent: "St Benedict's",
    location: "Away",
    venue: "Our Lady of Lourdes",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Our+Lady+of+Lourdes+Catholic+School+Richmond+VA",
  },
  {
    id: 4,
    date: "Sat 1/17",
    time: "3:00 PM",
    opponent: "St Bridget's",
    location: "Away",
    venue: "Veritas",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Veritas+School+Richmond+VA",
  },
  {
    id: 5,
    date: "Sat 1/24",
    time: "8:30 AM",
    opponent: "St Mary's",
    location: "Away",
    venue: "St Benedictine Main Floor",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=St+Benedictine+College+Prep+Richmond+VA",
  },
  {
    id: 6,
    date: "Sat 1/31",
    time: "2:00 PM",
    opponent: "Veritas",
    location: "Away",
    venue: "Veritas",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Veritas+School+Richmond+VA",
  },
];

function jerseyDotClass(jersey?: Game["jersey"]) {
  switch (jersey) {
    case "Purple":
      return "bg-purple-600";
    case "White":
      return "bg-slate-100 ring-1 ring-slate-300";
    case "Black":
      return "bg-slate-900";
    case "Gold":
      return "bg-amber-400";
    case "Navy":
      return "bg-indigo-900";
    case "Gray":
      return "bg-slate-400";
    default:
      return "bg-slate-300";
  }
}

function directionsHref(game: Game) {
  if (game.directionsUrl) return game.directionsUrl;
  // fallback: maps query based on venue name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    game.venue
  )}`;
}

function DateBadge({
  date,
  variant,
}: {
  date: string;
  variant: "upcoming" | "win" | "loss";
}) {
  const [dow, md] = date.split(" ");
  const [m, d] = (md ?? "").split("/");

  const color =
    variant === "win"
      ? "bg-green-600"
      : variant === "loss"
      ? "bg-red-600"
      : "bg-purple-600";

  return (
    <div
      className={[
        "flex h-14 w-14 flex-col items-center justify-center rounded-full text-white flex-shrink-0",
        color,
      ].join(" ")}
    >
      <div className="text-[11px] font-semibold leading-none opacity-90">
        {dow}
      </div>
      <div className="mt-0.5 text-sm font-semibold leading-none">
        {m}/{d}
      </div>
    </div>
  );
}

function GameMetaRow({
  game,
  showResult,
}: {
  game: Game;
  showResult: boolean;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {/* Home/Away pill */}
      <span
        className={[
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
          game.isHome
            ? "bg-purple-50 text-purple-700 ring-purple-200"
            : "bg-slate-50 text-slate-700 ring-slate-200",
        ].join(" ")}
      >
        {game.isHome ? "Home" : "Away"}
      </span>

      {/* ✅ Jersey - now visible on mobile */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
        <span className={["h-2.5 w-2.5 rounded-full", jerseyDotClass(game.jersey)].join(" ")} />
        <span className="inline-flex items-center gap-1">
          <Shirt className="size-3.5 text-slate-500" />
          {game.jersey ?? "TBD"}
        </span>
      </span>

      {/* ✅ Result - now visible on mobile */}
      {showResult && game.result ? (
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
            game.result.won
              ? "bg-green-50 text-green-700 ring-green-200"
              : "bg-red-50 text-red-700 ring-red-200",
          ].join(" ")}
        >
          {game.result.won ? "W" : "L"} • {game.result.score}
        </span>
      ) : null}
    </div>
  );
}

export default function Schedule() {
  const completed = games.filter((g) => !!g.result);
  const upcoming = games.filter((g) => !g.result);

  const wins = completed.filter((g) => g.result?.won).length;
  const losses = completed.filter((g) => g.result && !g.result.won).length;

  return (
    <div className="space-y-6">
      {/* Header row like Roster */}
      <div className="flex items-center gap-3">
        <Calendar className="size-8 text-purple-600" />
        <h2 className="text-2xl font-semibold">Game Schedule</h2>
      </div>

      {/* Team Record box (top) */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-purple-600" />
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                TEAM RECORD
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {wins}-{losses}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-wide text-slate-500">
              GAMES PLAYED
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {completed.length}
            </p>
          </div>
        </div>
      </div>

      {/* COMPLETED FIRST */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 tracking-wide">
          COMPLETED
        </h3>

        {completed.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 text-sm text-slate-600">
            No completed games yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {completed.map((game) => (
              <a
                key={game.id}
                href={directionsHref(game)}
                target="_blank"
                rel="noreferrer"
                className="
                  group block
                  rounded-2xl bg-white p-4
                  shadow-sm ring-1 ring-slate-200/70
                  transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg hover:ring-purple-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                "
              >
                <div className="flex items-start gap-4">
                  <DateBadge
                    date={game.date}
                    variant={game.result?.won ? "win" : "loss"}
                  />

                  <div className="min-w-0 flex-1">
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
  <h4 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
    vs {game.opponent}
  </h4>
  <span className="text-lg font-semibold text-slate-500">
    {game.time}
  </span>
</div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="size-4 text-slate-400" />
                      <span className="truncate">{game.venue}</span>
                    </div>

                    {/* ✅ mobile-friendly row w/ jersey + result */}
                    <GameMetaRow game={game} showResult />
                  </div>

                  {/* subtle affordance */}
                  <ChevronRight className="mt-1 size-5 text-slate-300 transition group-hover:text-purple-400" />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Tap for directions
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* UPCOMING SECOND */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-slate-500 tracking-wide">
          UPCOMING
        </h3>

        {upcoming.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 text-sm text-slate-600">
            No upcoming games listed yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((game) => (
              <a
                key={game.id}
                href={directionsHref(game)}
                target="_blank"
                rel="noreferrer"
                className="
                  group block
                  rounded-2xl bg-gradient-to-br from-purple-400 via-purple-900 to-indigo-800 p-4
                  shadow-sm ring-1 ring-purple-300/50
                  transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg hover:ring-purple-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                  text-white
                "
              >
                <div className="flex items-start gap-4">
                  <DateBadge date={game.date} variant="upcoming" />

                  <div className="min-w-0 flex-1">
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
  <h4 className="text-lg font-semibold text-white transition-colors group-hover:text-purple-100">
    vs {game.opponent}
  </h4>
  <span className="text-lg font-semibold text-white/80">
    {game.time}
  </span>
</div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="size-4 text-white/50" />
                      <span className="truncate">{game.venue}</span>
                    </div>

                    {/* ✅ mobile-friendly row w/ jersey (and no result) */}
                    <GameMetaRow game={game} showResult={false} />
                  </div>

                  <ChevronRight className="mt-1 size-5 text-white/50 transition group-hover:text-white/70" />
                </div>

                <p className="mt-3 text-xs text-white/60">
                  Tap for directions
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}