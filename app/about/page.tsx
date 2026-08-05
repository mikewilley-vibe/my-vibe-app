import IntroSection from "../components/content/IntroSection";
import ContactCard from "../components/content/ContactCard";
import FadeIn from "@/app/components/motion/FadeIn";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-12">
        <FadeIn>
          <IntroSection />
        </FadeIn>

        <FadeIn delay={0.12}>
          <ContactCard />
        </FadeIn>
      </div>
    </div>
  );
}
