"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import LatestVibesSection from "@/app/components/content/LatestVibesSection";
import VibeOfTheDay from "@/app/components/vibes/VibeOfTheDay";
import WeatherCard from "@/app/components/weather/WeatherCard";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import FamilySection from "@/app/components/content/FamilySection";
import SponsorRotator from "@/app/components/ui/SponsorRotator";
import { sponsors } from "@/app/data/sponsors";
import { isPersonalMode } from "@/lib/appConfig";

const personalCards = [
  { 
    title: "UVA Sports", 
    subtitle: "Games, Basketball & Football",
    emoji: "🏀", 
    href: "/uva", 
    color: "from-blue-500 to-indigo-600",
    cta: "View All"
  },
  { title: "Shows", emoji: "🎸", href: "/shows", color: "from-purple-500 to-pink-600", cta: "Explore" },
  { title: "Girl Scouts", emoji: "🍪", href: "https://bea-troop-site.vercel.app/", color: "from-green-500 to-emerald-600", cta: "Visit" },
  { title: "Orchard House", emoji: "🏀", href: "https://www.orchardhousebasketball.org/", color: "from-amber-500 to-orange-600", cta: "Learn" },
  { title: "HIIT Timer", emoji: "⏱️", href: "/workout-timer", color: "from-red-500 to-rose-600", cta: "Start" },
  { title: "Recipe Maker", emoji: "🌭", href: "https://local-sausage.vercel.app/", color: "from-yellow-500 to-amber-600", cta: "Browse" },
];

export default function HomePage() {
  const [isPersonal, setIsPersonal] = useState(false);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  // Personal mode: show card grid with family and calendar
  if (isPersonal) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <FadeIn delay={0}>
            <WeatherCard />
          </FadeIn>
          <FadeIn delay={0.1}>
            <ScoresBanner />
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Welcome Back
            </h1>
            <p className="mb-12 text-lg text-slate-600">Quick access to your favorite apps and utilities</p>
          </FadeIn>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personalCards.map((card, index) => (
              <FadeIn key={card.href} delay={0.3 + index * 0.05}>
                <Link href={card.href}>
                  <div className={`group relative h-40 rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex flex-col justify-between overflow-hidden`}>
                    {/* Background decorative element */}
                    <div className="absolute top-0 right-0 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">
                      {card.emoji}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-4xl mb-2 group-hover:scale-125 transition-transform origin-left">{card.emoji}</div>
                      <h3 className="font-bold text-xl">{card.title}</h3>
                      {card.subtitle && <p className="text-sm opacity-90">{card.subtitle}</p>}
                    </div>
                    
                    {/* CTA Button */}
                    <button className="relative z-10 self-start mt-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold text-sm transition-all border border-white/30 hover:border-white/50">
                      {card.cta}
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Family Section */}
          <FadeIn delay={0.6}>
            <div className="mb-16">
              <FamilySection />
            </div>
          </FadeIn>
        </div>
      </main>
    );
  }

  // Portfolio mode: show full featured home page
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-10">
        <FadeIn delay={0}>
          <SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <WeatherCard />
        </FadeIn>
        <FadeIn delay={0.2}>
          <ScoresBanner />
        </FadeIn>
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
      </div>
    </main>
  );
}