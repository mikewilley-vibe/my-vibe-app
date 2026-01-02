import FamilySection from "../components/content/FamilySection";
import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";

export default function AboutPage() {
  return (
<main className="min-h-screen bg-orange-100">      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
        <IntroSection />
        <FamilySection />
        <ContactCard />
      </div>
    </main>
  );
}