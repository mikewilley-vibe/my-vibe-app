import FamilySection from "../components/content/FamilySection";
import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";
import CalendarEmbed from "@/app/components/ui/CalendarEmbed";
import CalendarLinks from "@/app/components/ui/CalendarLinks";

export default function AboutPage() {
  return (
<main className="min-h-screen bg-orange-100">      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
        <IntroSection />
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
        <CalendarEmbed
          title="My Calendar"
          description="Public events I’ve shared"
          src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
          view="MONTH"
          height={720}
        />
        <FamilySection />
      
    
        <ContactCard />
      </div>
    </main>
  );
}