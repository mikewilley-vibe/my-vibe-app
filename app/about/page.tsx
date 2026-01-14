import FamilySection from "../components/content/FamilySection";
import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";
import CalendarEmbed from "@/app/components/ui/CalendarEmbed";
import CalendarLinks from "@/app/components/ui/CalendarLinks";
import FadeIn from "@/app/components/motion/FadeIn";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
        <FadeIn>
          <IntroSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <CalendarLinks
            title="Family School Calendars"
            calendars={[
              {
                label: "Katie School",
                href: "https://www.npsk12.com/our-division/academic-calendar/2025-2026-academic-calendar",
              },
              {
                label: "Bea School",
                href: "https://resources.finalsite.net/images/v1760363929/rvaschoolsnet/pivmboyjibodqzoiiqx8/ENG_2025-26RPS200Calendar1.pdf",
              },
              {
                label: "Mary School",
                href: "https://bloomerang-bee.s3.amazonaws.com/images/clapton_cysx6cjdvalm_us_west_2_rds_amazonaws_com_orchardhouse/Documents%20to%20Link/Calendar%20-%20Academic%20Calendar%2025-26%20%288.11.25%29.pdf?blm_aid=128083",
              },
            ]}
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <CalendarEmbed
            title="My Calendar"
            description="Public events I've shared"
            src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
            view="MONTH"
            height={720}
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <FamilySection />
        </FadeIn>
        <FadeIn delay={0.4}>
          <ContactCard />
        </FadeIn>
      </div>
    </main>
  );
}
