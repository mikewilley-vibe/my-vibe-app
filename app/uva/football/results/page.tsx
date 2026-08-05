import { getBaseUrl } from "@/lib/baseUrl";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";
import { safeFetch } from "@/lib/safeFetch";
import UvaTabs from "@/app/components/uva/UvaTabs";
import UvaPageHeader from "@/app/components/uva/UvaPageHeader";
import { UvaResultCard, UvaStat } from "@/app/components/uva/UvaResultsUi";
import { calcRecord, uvaPageBg, type UvaResultGame } from "@/app/components/uva/uvaTheme";

export const dynamic = "force-dynamic";

type ApiResp = {
  ok: boolean;
  updatedAt: string;
  results: UvaResultGame[];
};

export default async function UvaFootballResultsPage() {
  const baseUrl = await getBaseUrl();

  const { data, ok } = await safeFetch<ApiResp>(
    `${baseUrl}/api/uva/football/results?season=2025`,
    { cache: "no-store" }
  );

  if (!ok || !data?.ok) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <UvaTabs />
          <h1 className="font-display text-3xl font-semibold text-slate-900">UVA Football Results</h1>
          <p className="mt-4 text-sm text-slate-500">Football results are temporarily unavailable.</p>
        </section>
      </div>
    );
  }

  const updatedAt = new Date(data.updatedAt);
  const results = Array.isArray(data.results) ? data.results : [];
  const { w, l } = calcRecord(results);

  const left: UvaResultGame[] = [];
  const right: UvaResultGame[] = [];
  results.forEach((g, i) => (i % 2 === 0 ? left : right).push(g));

  return (
    <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <UvaTabs />

        <UvaPageHeader
          eyebrow="Results"
          title="Football Results"
          description={`2025 season · last updated ${updatedAt.toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}`}
        />

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <UvaStat label="2025 Record" value={`${w}–${l}`} />
          <UvaStat label="Games shown" value={`${results.length}`} />
          <UvaStat
            label="Last updated"
            value={updatedAt.toLocaleString("en-US", {
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
            No 2025 finals found.
          </div>
        ) : (
          <TwoColumnSection className="gap-6">
            <div className="space-y-3">
              {left.map((g) => (
                <UvaResultCard key={`${g.dateIso}-${g.opponent}`} g={g} />
              ))}
            </div>
            <div className="space-y-3">
              {right.map((g) => (
                <UvaResultCard key={`${g.dateIso}-${g.opponent}-r`} g={g} />
              ))}
            </div>
          </TwoColumnSection>
        )}
      </section>
    </div>
  );
}
