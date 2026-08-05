import {
  UVA_BLUE,
  UVA_ORANGE,
  chipMeta,
  fmtResultDate,
  parseResultScore,
  type UvaResultGame,
} from "./uvaTheme";

export function UvaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-display text-xl font-semibold" style={{ color: UVA_BLUE }}>
        {value}
      </div>
    </div>
  );
}

export function UvaResultCard({
  g,
  recapLabel = "Recap",
}: {
  g: UvaResultGame;
  recapLabel?: string;
}) {
  const meta = chipMeta(g.homeAway);
  const { wl, a, b } = parseResultScore(g.score);
  const isWin = wl === "W";

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-slate-600">{fmtResultDate(g.dateIso)}</div>
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold"
              style={{ background: meta.bg, color: meta.fg }}
            >
              {meta.text}
            </span>
          </div>

          <h3 className="mt-1 truncate font-display text-lg font-semibold text-slate-900">
            vs {g.opponent}
          </h3>

          <div className="mt-1 text-sm font-semibold">
            <span className={isWin ? "text-emerald-700" : "text-rose-700"}>{wl ?? ""}</span>{" "}
            <span className="text-slate-900">
              {a !== null && b !== null ? `${a}\u2013${b}` : g.score}
            </span>
          </div>

          {g.sourceUrl ? (
            <a
              href={g.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ color: UVA_ORANGE }}
            >
              {recapLabel} <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>

        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-bold"
          style={{
            backgroundColor: isWin ? `${UVA_BLUE}` : "#f8fafc",
            color: isWin ? UVA_ORANGE : "#64748b",
            border: `1px solid ${isWin ? UVA_ORANGE : "#e2e8f0"}`,
          }}
          aria-hidden="true"
        >
          {wl ?? "—"}
        </div>
      </div>
    </article>
  );
}
