import { getUvaBasketballSchedule } from "@/lib/uvaBasketballSchedule";
import { getUvaFootballSchedule } from "@/lib/uvaFootballSchedule";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import UvaTabs from "@/app/components/uva/UvaTabs";
import UvaPageHeader from "@/app/components/uva/UvaPageHeader";
import UvaScheduleSection, {
  type ScheduleGame,
} from "@/app/components/uva/UvaScheduleSection";
import { UVA_BLUE, uvaPageBg } from "@/app/components/uva/uvaTheme";

export const dynamic = "force-dynamic";

function upcomingFrom(games: ScheduleGame[] | undefined) {
  const now = new Date();
  return (games ?? [])
    .filter((g) => {
      const d = new Date(g.date);
      return !Number.isNaN(d.getTime()) && d > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default async function UvaPage() {
  const [football, basketball] = await Promise.all([
    getUvaFootballSchedule(),
    getUvaBasketballSchedule(),
  ]);

  const footballUpcoming = upcomingFrom(football.games);
  const basketballUpcoming = upcomingFrom(basketball.games);

  if (football.games.length === 0 && basketball.games.length === 0) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <UvaTabs />
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 sm:p-8">
            <h1 className="font-display text-3xl font-semibold" style={{ color: UVA_BLUE }}>
              UVA Schedules
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              Upcoming games are temporarily unavailable. Please try again in a few minutes.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-white/80 px-3 py-2 font-mono text-xs text-rose-700">
                {football.error || basketball.scrapeError || "Unknown fetch error"}
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  const nextGame = footballUpcoming[0] ?? basketballUpcoming[0];
  const nextSport = footballUpcoming[0] ? "Football" : basketballUpcoming[0] ? "Basketball" : null;

  return (
    <div className="min-h-screen pb-16" style={{ backgroundImage: uvaPageBg() }}>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <UvaTabs />

        <UvaPageHeader
          eyebrow="Athletics"
          title="UVA Schedules"
          description={
            nextGame && nextSport
              ? `Next up (${nextSport}): vs ${nextGame.opponent}`
              : "Upcoming Cavaliers football and basketball"
          }
        />

        <div className="mb-10">
          <ScoresBanner />
        </div>

        <UvaScheduleSection
          sportLabel="Football"
          title="Upcoming games"
          games={footballUpcoming}
          resultsHref="/uva/football/results"
        />

        <UvaScheduleSection
          sportLabel="Basketball"
          title="Upcoming games"
          games={basketballUpcoming}
          resultsHref="/uva/basketball/results"
        />
      </section>
    </div>
  );
}
