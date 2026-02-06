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
import PersonalCardGrid from "@/app/components/ui/PersonalCardGrid";

const personalCards = [
  { 
    title: "UVA Sports", 
    subtitle: "Games, Basketball & Football",
    emoji: "🏀", 
    href: "/uva", 
    color: "from-blue-500 to-indigo-600",
    cta: "View All",
    image: "/images/scott.png"
  },
  { 
    title: "Shows", 
    emoji: "🎸", 
    href: "/shows", 
    color: "from-purple-500 to-pink-600", 
    cta: "Explore",
    image: "/images/rock.png"
  },
  { 
    title: "Girl Scouts", 
    emoji: "🍪", 
    href: "https://bea-troop-site.vercel.app/", 
    color: "from-green-500 to-emerald-600", 
    cta: "Visit",
    image: "/images/cookie.png"
  },
  { 
    title: "Orchard House", 
    emoji: "🏀", 
    href: "https://www.orchardhousebasketball.org/", 
    color: "from-amber-500 to-orange-600", 
    cta: "Learn",
    image: "/images/ohball.png"
  },
  { 
    title: "HIIT Timer", 
    emoji: "⏱️", 
    href: "/workout-timer", 
    color: "from-red-500 to-rose-600", 
    cta: "Start",
    image: "/images/hiit.png"
  },
  { 
    title: "Seasonal Sous Chef", 
    emoji: "🍽️", 
    href: "https://local-sausage.vercel.app/", 
    color: "from-yellow-500 to-amber-600", 
    cta: "Browse",
    image: "/images/kitchen.png"
  },
];

export default function HomePage() {
  const [isPersonal, setIsPersonal] = useState(false);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  // Personal mode: show card grid with family and calendar
  if (isPersonal) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/10 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 space-y-20">
          {/* Top Section: Status & Quick Info */}
          <FadeIn delay={0}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1">
                <h1 className="headline-lg text-slate-900 mb-3">
                  Welcome back, Mike
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                  Here's your family hub. Weather, schedules, games, and quick access to everything that matters.
                </p>
              </div>
              <div className="flex-shrink-0">
                <WeatherCard />
              </div>
            </div>
          </FadeIn>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Games & Sports Section */}
          <FadeIn delay={0.1}>
            <ScoresBanner />
          </FadeIn>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Calendar Section - Left Heavy (Asymmetric) */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Calendar - 2 cols */}
              <div className="lg:col-span-2">
                <p className="label-xs text-blue-600 uppercase mb-4">Upcoming Events</p>
                <h2 className="headline-md text-slate-900 mb-6">
                  Family Calendar
                </h2>
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <CalendarEmbed
                    title="My Calendar"
                    description="Public events I've shared"
                    src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
                    view="MONTH"
                    height={500}
                  />
                </div>
              </div>

              {/* School Calendars - 1 col */}
              <div className="lg:col-span-1">
                <p className="label-xs text-blue-600 uppercase mb-4">Quick Links</p>
                <h3 className="headline-md text-slate-900 mb-6">
                  School Calendars
                </h3>
                <div className="space-y-3">
                  {/* Katie School */}
                  <Link
                    href="https://www.npsk12.com/our-division/academic-calendar/2025-2026-academic-calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-blue-200/50 hover:border-blue-400 transition-all hover:shadow-md hover:-translate-y-0.5 block"
                  >
                    <div className="bg-gradient-to-br from-blue-50/60 to-slate-50/60 backdrop-blur-sm p-4 flex flex-col items-center justify-center hover:from-blue-100/60 hover:to-slate-100/60 transition-all h-auto py-6">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center">Katie</h4>
                      <p className="text-xs text-slate-600 text-center mt-1">2025-26</p>
                    </div>
                  </Link>

                  {/* Bea School */}
                  <Link
                    href="https://resources.finalsite.net/images/v1760363929/rvaschoolsnet/pivmboyjibodqzoiiqx8/ENG_2025-26RPS200Calendar1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-amber-200/50 hover:border-amber-400 transition-all hover:shadow-md hover:-translate-y-0.5 block"
                  >
                    <div className="bg-gradient-to-br from-amber-50/60 to-slate-50/60 backdrop-blur-sm p-4 flex flex-col items-center justify-center hover:from-amber-100/60 hover:to-slate-100/60 transition-all h-auto py-6">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📖</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center">Bea</h4>
                      <p className="text-xs text-slate-600 text-center mt-1">RPS</p>
                    </div>
                  </Link>

                  {/* Mary School */}
                  <Link
                    href="https://bloomerang-bee.s3.amazonaws.com/images/clapton_cysx6cjdvalm_us_west_2_rds_amazonaws_com_orchardhouse/Documents%20to%20Link/Calendar%20-%20Academic%20Calendar%2025-26%20%288.11.25%29.pdf?blm_aid=128083"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-emerald-200/50 hover:border-emerald-400 transition-all hover:shadow-md hover:-translate-y-0.5 block"
                  >
                    <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50/60 backdrop-blur-sm p-4 flex flex-col items-center justify-center hover:from-emerald-100/60 hover:to-slate-100/60 transition-all h-auto py-6">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✏️</div>
                      <h4 className="text-xs font-bold text-slate-900 text-center">Mary</h4>
                      <p className="text-xs text-slate-600 text-center mt-1">Orchard</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Card Grid */}
          <FadeIn delay={0.25}>
            <PersonalCardGrid cards={personalCards} />
          </FadeIn>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Family Section */}
          <FadeIn delay={0.4}>
            <FamilySection />
          </FadeIn>
        </div>
      </main>
    );
  }

  // Portfolio mode: show full featured home page
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/5 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-24 pt-12">
        {/* Top Banner */}
        <FadeIn delay={0}>
          <SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />
        </FadeIn>

        {/* Premium Hero Section */}
        <FadeIn delay={0.1}>
          <HomeHeroSection />
        </FadeIn>

        {/* Divider with breathing room */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

        {/* Weather & Vibe */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <WeatherCard />
            </div>
            <div className="md:col-span-2">
              <ScoresBanner />
            </div>
          </div>
        </FadeIn>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

        {/* Latest Vibes */}
        <FadeIn delay={0.3}>
          <LatestVibesSection />
        </FadeIn>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

        {/* Featured Projects */}
        <FadeIn delay={0.4}>
          <FeaturedProjectsSection />
        </FadeIn>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

        {/* Vibe of the Day */}
        <FadeIn delay={0.5}>
          <VibeOfTheDay />
        </FadeIn>
      </div>
    </main>
  );
}