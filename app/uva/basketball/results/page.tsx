// app/uva/basketball/results/page.tsx
import { getBaseUrl } from "@/lib/baseUrl";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";
import { safeFetch } from "@/lib/safeFetch";
export const dynamic = "force-dynamic";

const UVA_ORANGE = "#F84C1E";
const UVA_BLUE = "#232D4B";

type ResultGame = {
  dateIso: string;
  opponent: string;
  score: string; // "W 95–51"
  homeAway?: "home" | "away" | "neutral";
  sourceUrl?: string;
};

type ApiResp = {
  ok: boolean;
  updatedAt: string;
  results: ResultGame[];
};

function parseResultScore(score: string) {
  const s = String(score ?? "").trim();
  const wl = s.startsWith("W") ? "W" : s.startsWith("L") ? "L" : null;

  const nums = s.match(/(\d+)\D+(\d+)/);
  const a = nums ? Number(nums[1]) : null;
  const b = nums ? Number(nums[2]) : null;

  return { wl, a, b };
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

function chipMeta(homeAway?: string) {
  const v = String(homeAway ?? "").toLowerCase();
  if (v === "home") return { text: "HOME", bg: UVA_BLUE, fg: "#fff" };
  if (v === "away") return { text: "AWAY", bg: UVA_ORANGE, fg: "#fff" };
  return { text: "NEUTRAL", bg: "#334155", fg: "#fff" };
}

function calcRecord(results: ResultGame[]) {
  let w = 0;
  let l = 0;
  for (const r of results) {
    const { wl } = parseResultScore(r.score);
    if (wl === "W") w++;
    else if (wl === "L") l++;
  }
  return { w, l };
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-1 text-sm font-extrabold text-slate-900">{value}</div>
  </div>
);

function ResultCard({ g }: { g: ResultGame }) {
  const meta = chipMeta(g.homeAway);
  const { wl, a, b } = parseResultScore(g.score);
  const isWin = wl === "W";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-600">{fmtDate(g.dateIso)}</div>

            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold"
              style={{ background: meta.bg, color: meta.fg }}
            >
              {meta.text}
            </span>
          </div>

          <div className="mt-1 truncate text-base font-extrabold text-slate-900">
            vs {g.opponent}
          </div>

          <div className="mt-1 text-sm font-semibold">
            <span className={isWin ? "text-emerald-700" : "text-rose-700"}>
              {wl ?? ""}
            </span>{" "}
            <span className="text-slate-900">
              {a !== null && b !== null ? `${a}\u2013${b}` : g.score}
            </span>
          </div>

          {g.sourceUrl ? (
            <a
              href={g.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
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

export default async function UvaBasketballResultsPage() {
  const baseUrl = await getBaseUrl();

  const { data, ok } = await safeFetch<ApiResp>(`${baseUrl}/api/uva/basketball/results`, {
    cache: "no-store",
  });

  if (!ok || !data?.ok) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">UVA Basketball Results</h1>
          <p className="mt-4 text-sm text-slate-500">
            Basketball results are temporarily unavailable.
          </p>
        </section>
      </main>
    );
  }

  const updatedAt = new Date(data.updatedAt);
  const results = Array.isArray(data.results) ? data.results : [];
  const { w, l } = calcRecord(results);

  // same ordering as football: API already returns newest-first, then we split alternating
  const left: ResultGame[] = [];
  const right: ResultGame[] = [];
  results.forEach((g, i) => (i % 2 === 0 ? left : right).push(g));

  return (
    <main
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${UVA_BLUE}11, ${UVA_ORANGE}11)` }}
    >
      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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

        {/* Summary */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Record" value={`${w}–${l}`} />
            <Stat label="Games shown" value={`${results.length}`} />
            <Stat
              label="Last updated"
              value={updatedAt.toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            />
          </div>
        </div>

        {/* Two columns */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
            No finals found.
          </div>
        ) : (
          <TwoColumnSection className="gap-6">
            <div className="space-y-3">
              {left.map((g) => (
                <ResultCard key={`${g.dateIso}-${g.opponent}`} g={g} />
              ))}
            </div>
            <div className="space-y-3">
              {right.map((g) => (
                <ResultCard key={`${g.dateIso}-${g.opponent}-r`} g={g} />
              ))}
            </div>
          </TwoColumnSection>
        )}
      </section>
    </main>
  );
}