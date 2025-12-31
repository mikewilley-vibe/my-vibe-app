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
    
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 pb-16 pt-10">
           <div className="mb-8">
 
        
<SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />
<div className="mb-2 mt-4 flex flex-col gap-8">
  <WeatherCard />
</div>
  <ScoresBanner />

</div>
        <FadeIn>
         <HomeHeroSection />
        </FadeIn>
     
        <LatestVibesSection />
<FeaturedProjectsSection />
    <VibeOfTheDay />
    <UvaNextGames count={2} />
      </div>
    </main>
  );
}