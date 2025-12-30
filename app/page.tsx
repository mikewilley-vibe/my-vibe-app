import FadeIn from "@/app/components/motion/FadeIn";
import UvaNextGames from "@/app/components/uva/UvaNextGames";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import LatestVibesSection from "@/app/components/content/LatestVibesSection";
import VibeOfTheDay from "@/app/components/vibes/VibeOfTheDay";
import WeatherCard from "@/app/components/weather/WeatherCard";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import AdBanner from "@/app/components/ui/AdBanner";
import BrandBadgeLink from "@/app/components/ui/BrandBadgeLink";

export default function HomePage() {
  return (
    
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 pb-16 pt-10">
           <div className="mb-8">
        
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
  <AdBanner
    sponsor="Reduce Risk With Reliable Insurance"
    headline="Nusbaum Insurance"
    copy="The Solution To Your Insurance Needs"
    cta="Get a quote"
    href="https://nusbauminsurance.com/"
    variant="slate"
   brand={
    <BrandBadgeLink
      href="https://nusbauminsurance.com/"
      logoSrc="/images/Nusbaum-Insurance-Agency-Logo-800.png"
      alt="Nusbaum Insurance"
    />
  }
/>
  <AdBanner
    sponsor="Clean books, clear dashboards, and proactive tax planning for small business."
    headline="Vandy Accounting Solutions"
    copy="Your outsourced accounting solution."
    cta="Work with Vandy"
    href="https://vandy-accounting-migration.vercel.app/" // or your vandy site link later
    variant="emerald"
    brand={
    <BrandBadgeLink
      href="https://vandy-accounting-migration.vercel.app/"
      logoSrc="/images/logo.png"
      alt="Vandy Accounting"
  />
    }
    />
</div>

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