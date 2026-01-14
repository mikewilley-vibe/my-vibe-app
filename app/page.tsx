import FadeIn from "@/app/components/motion/FadeIn";
import UvaNextGames from "@/app/components/uva/UvaNextGames";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import LatestVibesSection from "@/app/components/content/LatestVibesSection";
import VibeOfTheDay from "@/app/components/vibes/VibeOfTheDay";
import WeatherCard from "@/app/components/weather/WeatherCard";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import SponsorRotator from "@/app/components/ui/SponsorRotator";
import { sponsors } from "@/app/data/sponsors";

// ...

<SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />

export default function HomePage() {
  return (
    
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-16 pt-10">
           <div className="mb-8 space-y-6">
<FadeIn delay={0}>
<SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />
</FadeIn>
<div className="mb-2 mt-4 flex flex-col gap-8">
  <FadeIn delay={0.1}>
  <WeatherCard />
  </FadeIn>
</div>
  <FadeIn delay={0.2}>
  <ScoresBanner />
  </FadeIn>
</div>
        <FadeIn delay={0.3}>
         <HomeHeroSection />
        </FadeIn>
     
        <FadeIn delay={0.4}>
        <LatestVibesSection />
        </FadeIn>
<FadeIn delay={0.5}>
<FeaturedProjectsSection />
</FadeIn>
    <FadeIn delay={0.6}>
    <VibeOfTheDay />
    </FadeIn>
    <FadeIn delay={0.7}>
    <UvaNextGames count={2} />
    </FadeIn>
      </div>
    </main>
  );
}