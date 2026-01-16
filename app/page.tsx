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
import CalendarEmbed from "@/app/components/ui/CalendarEmbed";
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
  { title: "Seasonal Sous Chef", emoji: "🍽️", href: "https://local-sausage.vercel.app/", color: "from-yellow-500 to-amber-600", cta: "Browse" },
];

export default function HomePage() {
  const [isPersonal, setIsPersonal] = useState(false);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  // Personal mode: show card grid with family and calendar
  if (isPersonal) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <FadeIn delay={0}>
            <WeatherCard />
          </FadeIn>
          <FadeIn delay={0.1}>
            <ScoresBanner />
          </FadeIn>

          {/* Calendar Section at Top */}
          <FadeIn delay={0.2}>
            <div className="mb-16">
              <CalendarEmbed
                title="My Calendar"
                description="Public events I've shared"
                src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
                view="MONTH"
                height={500}
              />
            </div>
          </FadeIn>

          {/* School Calendars */}
          <FadeIn delay={0.25}>
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Family School Calendars</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Katie School */}
                <Link
                  href="https://www.npsk12.com/our-division/academic-calendar/2025-2026-academic-calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-slate-200 hover:border-blue-400 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 flex flex-col items-center justify-center hover:from-blue-100 hover:to-slate-100 transition-all h-48">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                    <h4 className="text-sm font-bold text-slate-900 text-center mb-2">Katie</h4>
                    <p className="text-xs text-slate-600 text-center leading-relaxed">2025-26<br/>Academic<br/>Calendar</p>
                  </div>
                </Link>

                {/* Bea School */}
                <Link
                  href="https://resources.finalsite.net/images/v1760363929/rvaschoolsnet/pivmboyjibodqzoiiqx8/ENG_2025-26RPS200Calendar1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-6 flex flex-col items-center justify-center hover:from-amber-100 hover:to-slate-100 transition-all h-48">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                    <h4 className="text-sm font-bold text-slate-900 text-center mb-2">Bea</h4>
                    <p className="text-xs text-slate-600 text-center leading-relaxed">RPS 2025-26<br/>Academic<br/>Calendar</p>
                  </div>
                </Link>

                {/* Mary School */}
                <Link
                  href="https://bloomerang-bee.s3.amazonaws.com/images/clapton_cysx6cjdvalm_us_west_2_rds_amazonaws_com_orchardhouse/Documents%20to%20Link/Calendar%20-%20Academic%20Calendar%2025-26%20%288.11.25%29.pdf?blm_aid=128083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-slate-200 hover:border-emerald-400 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-emerald-50 to-slate-50 p-6 flex flex-col items-center justify-center hover:from-emerald-100 hover:to-slate-100 transition-all h-48">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
                    <h4 className="text-sm font-bold text-slate-900 text-center mb-2">Mary</h4>
                    <p className="text-xs text-slate-600 text-center leading-relaxed">Academic<br/>Calendar<br/>2025-26</p>
                  </div>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Welcome Section */}
          <FadeIn delay={0.3}>
            <h1 className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Welcome Back
            </h1>
            <p className="mb-12 text-lg text-slate-600">Quick access to your favorite apps and utilities</p>
          </FadeIn>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personalCards.map((card, index) => (
              <FadeIn key={card.href} delay={0.35 + index * 0.05}>
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
          <FadeIn delay={0.65}>
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