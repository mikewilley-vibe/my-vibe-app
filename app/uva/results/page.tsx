// app/uva/results/page.tsx
import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";

const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

type ResultGame = {
  dateIso: string;
  opponent: string;
  score: string; // "W 72–65"
  homeAway?: "home" | "away" | "neutral";
  sourceUrl?: string;
};

type ResultsApiResponse = {
  ok: boolean;
  updatedAt: string;
  results: ResultGame[];
  error?: string;
};

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function scoreMeta(score: string) {
  const s = String(score ?? "");
  const isW = s.trim().startsWith("W");
  const isL = s.trim().startsWith("L");
  return {
    text: s || "—",
    isW,
    isL,
  };
}

function haChip(ha?: ResultGame["homeAway"]) {
  const v = (ha ?? "neutral").toLowerCase();
  if (v === "home") return { text: "HOME", bg: UVA_BLUE, fg: "#fff" };
  if (v === "away") return { text: "AWAY", bg: UVA_ORANGE, fg: "#fff" };
  return { text: "NEUTRAL", bg: "#0f172a", fg: "#fff" };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

function ResultCard({ g }: { g: ResultGame }) {
  const when = fmtDateTime(g.dateIso);
  const ha = haChip(g.homeAway);
  const sm = scoreMeta(g.score);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-600">{when}</div>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ background: ha.bg, color: ha.fg }}
            >
              {ha.text}
            </span>
          </div>

          <div className="mt-1 truncate text-base font-extrabold text-slate-900">
            vs {g.opponent}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold"
              style={{
                background: sm.isW ? "#dcfce7" : sm.isL ? "#ffe4e6" : "#e2e8f0",
                color: sm.isW ? "#166534" : sm.isL ? "#9f1239" : "#0f172a",
              }}
            >
              {sm.text}
            </span>

            <span className="text-xs text-slate-500">Final</span>
          </div>

          {g.sourceUrl ? (
            <a
              href={g.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              ESPN recap <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>

        <div className="grid place-items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="text-xl">🏀</div>
        </div>
      </div>
    </div>
  );
}

export default async function UvaResultsPage() {
  const baseUrl = await getBaseUrl();

  const { data, ok } = await safeFetch<ResultsApiResponse>(`${baseUrl}/api/uva/results`, {
    cache: "no-store",
  });

  const updatedAt = data?.updatedAt ? new Date(data.updatedAt) : new Date();
  const results = data?.results ?? [];

  // record
  const wins = results.filter((g) => String(g.score ?? "").trim().startsWith("W")).length;
  const losses = results.filter((g) => String(g.score ?? "").trim().startsWith("L")).length;
  const total = wins + losses;

  if (!ok || !data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">UVA Results</h1>
          <p className="mt-4 text-sm text-slate-500">Results are temporarily unavailable.</p>
        </section>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${UVA_BLUE}11, ${UVA_ORANGE}11)` }}
    >
      <section className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: UVA_BLUE }}>
              UVA Basketball Results
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

        {/* Summary + banner */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Record" value={`${wins}–${losses}`} />
            <Stat label="Games counted" value={`${total}`} />
            <Stat
              label="Updated"
              value={updatedAt.toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            />
          </div>

        </div>

        {/* Content */}
        <TwoColumnSection className="gap-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: UVA_BLUE }}>
              Recent Results
            </h2>

            {results.length === 0 ? (
              <p className="text-sm text-slate-600">No final results found yet.</p>
            ) : (
              <div className="space-y-4">
                {results.slice(0, Math.ceil(results.length / 2)).map((g) => (
                  <ResultCard key={`${g.dateIso}-${g.opponent}`} g={g} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: UVA_BLUE }}>
              More Results
            </h2>

            {results.length === 0 ? null : (
              <div className="space-y-4">
                {results.slice(Math.ceil(results.length / 2)).map((g) => (
                  <ResultCard key={`${g.dateIso}-${g.opponent}`} g={g} />
                ))}
              </div>
            )}
          </div>
        </TwoColumnSection>
      </section>
    </main>
  );
}