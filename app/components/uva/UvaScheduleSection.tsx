import { UVA_BLUE, UVA_ORANGE } from "./uvaTheme";

export type ScheduleGame = {
  id: string;
  opponent: string;
  date: string;
  location: "home" | "away" | "neutral";
  note?: string;
  sourceUrl?: string;
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

function LocationChip({ location }: { location: ScheduleGame["location"] }) {
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

type Props = {
  sportLabel: string;
  title: string;
  games: ScheduleGame[];
  resultsHref?: string;
};

export default function UvaScheduleSection({
  sportLabel,
  title,
  games,
  resultsHref,
}: Props) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: UVA_ORANGE }}>
            {sportLabel}
          </p>
          <h2 className="font-display text-2xl font-semibold" style={{ color: UVA_BLUE }}>
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600 tabular-nums">
            {games.length === 0 ? "0 shown" : `${games.length} shown`}
          </span>
          {resultsHref ? (
            <a
              href={resultsHref}
              className="font-semibold hover:underline"
              style={{ color: UVA_ORANGE }}
            >
              Results →
            </a>
          ) : null}
        </div>
      </div>

      {games.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
          No upcoming games found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {games.map((g, idx) => (
            <article
              key={g.id}
              className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
