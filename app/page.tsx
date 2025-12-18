import FadeIn from "@/app/components/motion/FadeIn";
import UvaNextGames from "@/app/components/uva/UvaNextGames";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import LatestVibesSection from "@/app/components/content/LatestVibesSection";
import VibeOfTheDay from "@/app/components/vibes/VibeOfTheDay";
import WeatherCard from "@/app/components/weather/WeatherCard";
import ScoresBanner from "@/app/components/sports/ScoresBanner";

export default function HomePage() {
  return (
    
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 pb-16 pt-10">
           <div className="mt-4 space-y-2">
  <WeatherCard />
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