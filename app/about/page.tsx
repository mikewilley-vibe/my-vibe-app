import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";
import FadeIn from "@/app/components/motion/FadeIn";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        {/* Header */}
        <FadeIn>
          <IntroSection />
        </FadeIn>

        {/* Full Width: How to Reach Me */}
        <FadeIn delay={0.3}>
          <ContactCard />
        </FadeIn>
      </div>
    </main>
  );
}
