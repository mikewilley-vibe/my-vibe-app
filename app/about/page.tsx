import FamilySection from "../components/content/FamilySection";
import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";
import CalendarEmbed from "@/app/components/ui/CalendarEmbed";
import FadeIn from "@/app/components/motion/FadeIn";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        {/* Header */}
        <FadeIn>
          <IntroSection />
        </FadeIn>

        {/* Two Column Layout: About Mike + Calendar */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Family Section */}
          <div className="space-y-8">
            <FadeIn delay={0.1}>
              <FamilySection />
            </FadeIn>
          </div>

          {/* Right Column: Calendar + School Calendars */}
          <div className="space-y-8">
            <FadeIn delay={0.2}>
              <CalendarEmbed
                title="My Calendar"
                description="Public events I've shared"
                src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
                view="MONTH"
                height={500}
              />
            </FadeIn>

            {/* School Calendars in Skinny Columns */}
            <FadeIn delay={0.25}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Family School Calendars</h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* Katie School */}
                  <Link
                    href="https://www.npsk12.com/our-division/academic-calendar/2025-2026-academic-calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border border-slate-200 hover:border-blue-400 transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-50 p-3 flex flex-col items-center justify-center hover:from-blue-100 hover:to-slate-100 transition-colors">
                      <div className="text-2xl mb-2">📚</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center mb-2">Katie</h4>
                      <p className="text-[10px] text-slate-600 text-center">2025-26<br/>Academic<br/>Calendar</p>
                    </div>
                  </Link>

                  {/* Bea School */}
                  <Link
                    href="https://resources.finalsite.net/images/v1760363929/rvaschoolsnet/pivmboyjibodqzoiiqx8/ENG_2025-26RPS200Calendar1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border border-slate-200 hover:border-blue-400 transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-amber-50 to-slate-50 p-3 flex flex-col items-center justify-center hover:from-amber-100 hover:to-slate-100 transition-colors">
                      <div className="text-2xl mb-2">📖</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center mb-2">Bea</h4>
                      <p className="text-[10px] text-slate-600 text-center">RPS 2025-26<br/>Academic<br/>Calendar</p>
                    </div>
                  </Link>

                  {/* Mary School */}
                  <Link
                    href="https://bloomerang-bee.s3.amazonaws.com/images/clapton_cysx6cjdvalm_us_west_2_rds_amazonaws_com_orchardhouse/Documents%20to%20Link/Calendar%20-%20Academic%20Calendar%2025-26%20%288.11.25%29.pdf?blm_aid=128083"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border border-slate-200 hover:border-blue-400 transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-emerald-50 to-slate-50 p-3 flex flex-col items-center justify-center hover:from-emerald-100 hover:to-slate-100 transition-colors">
                      <div className="text-2xl mb-2">✏️</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center mb-2">Mary</h4>
                      <p className="text-[10px] text-slate-600 text-center">Academic<br/>Calendar<br/>2025-26</p>
                    </div>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Full Width: How to Reach Me */}
        <FadeIn delay={0.3}>
          <ContactCard />
        </FadeIn>
      </div>
    </main>
  );
}
