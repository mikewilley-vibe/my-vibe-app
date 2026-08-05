"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";
import ScrollReveal from "@/app/components/motion/ScrollReveal";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import PersonalHomeHero from "@/app/components/hero/PersonalHomeHero";
import LatestVibesSection from "@/app/components/content/LatestVibesSection";
import VibeOfTheDay from "@/app/components/vibes/VibeOfTheDay";
import WeatherCard from "@/app/components/weather/WeatherCard";
import ScoresBanner from "@/app/components/sports/ScoresBanner";
import FamilySection from "@/app/components/content/FamilySection";
import CalendarEmbed from "@/app/components/ui/CalendarEmbed";
import SectionHeader from "@/app/components/ui/SectionHeader";
import SponsorRotator from "@/app/components/ui/SponsorRotator";
import { sponsors } from "@/app/data/sponsors";
import { isPersonalMode } from "@/lib/appConfig";
import PersonalCardGrid from "@/app/components/ui/PersonalCardGrid";

const personalCards = [
  {
    title: "Shows",
    subtitle: "Hampton Roads, Richmond, and DC",
    href: "/shows",
    cta: "Find a show",
    image: "/images/rock.png",
    featured: true,
  },
  {
    title: "UVA Sports",
    subtitle: "Upcoming Cavaliers games",
    href: "/uva",
    cta: "View games",
    image: "/images/scott.png",
    featured: true,
  },
  {
    title: "HIIT Timer",
    subtitle: "Work • rest • repeat",
    href: "/workout-timer",
    cta: "Start session",
    image: "/images/hiit.png",
    featured: true,
  },
  {
    title: "Girl Scouts",
    href: "https://bea-troop-site.vercel.app/",
    cta: "Visit troop",
    image: "/images/cookie.png",
  },
  {
    title: "Orchard House",
    href: "https://www.orchardhousebasketball.org/",
    cta: "Open site",
    image: "/images/ohbball.png",
  },
  {
    title: "Sous Chef",
    href: "https://local-sausage.vercel.app/",
    cta: "Browse recipes",
    image: "/images/kitchen.png",
  },
];

const schoolLinks = [
  {
    name: "Katie",
    detail: "Norfolk Public Schools · 2025–26",
    href: "https://www.npsk12.com/our-division/academic-calendar/2025-2026-academic-calendar",
  },
  {
    name: "Bea",
    detail: "Richmond Public Schools",
    href: "https://resources.finalsite.net/images/v1760363929/rvaschoolsnet/pivmboyjibodqzoiiqx8/ENG_2025-26RPS200Calendar1.pdf",
  },
  {
    name: "Mary",
    detail: "Orchard House academic calendar",
    href: "https://bloomerang-bee.s3.amazonaws.com/images/clapton_cysx6cjdvalm_us_west_2_rds_amazonaws_com_orchardhouse/Documents%20to%20Link/Calendar%20-%20Academic%20Calendar%2025-26%20%288.11.25%29.pdf?blm_aid=128083",
  },
];

export default function HomePage() {
  const [isPersonal, setIsPersonal] = useState<boolean | null>(null);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  if (isPersonal === null) {
    return <div className="min-h-[50vh] bg-[var(--paper)]" aria-hidden="true" />;
  }

  if (isPersonal) {
    return (
      <div className="min-h-screen pb-16">
        <PersonalHomeHero />

        <div className="mx-auto max-w-6xl px-4 space-y-20 pt-14 sm:pt-16">
          <ScrollReveal>
            <section id="today" className="scroll-mt-24">
              <SectionHeader
                eyebrow="Today"
                title="Family calendar"
                description="What’s ahead at home — plus the school calendars in one place."
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-8 overflow-hidden rounded-2xl ring-1 ring-[var(--fog)] bg-white shadow-sm">
                  <CalendarEmbed
                    title="Family Calendar"
                    description="Public events I've shared"
                    src="https://calendar.google.com/calendar/embed?src=mikewilley%40gmail.com&ctz=America%2FNew_York"
                    view="MONTH"
                    height={520}
                    showHeader={false}
                  />
                </div>

                <aside className="lg:col-span-4">
                  <div className="rounded-2xl border border-[var(--fog)] bg-white/80 p-5 sm:p-6">
                    <p className="label-xs mb-1">School year</p>
                    <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-5">
                      Calendars
                    </h3>
                    <ul className="space-y-3">
                      {schoolLinks.map((school) => (
                        <li key={school.name}>
                          <Link
                            href={school.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start justify-between gap-3 rounded-xl border border-transparent bg-[var(--paper)] px-4 py-3.5 transition hover:border-[var(--harbor)]/30 hover:bg-white"
                          >
                            <div>
                              <div className="font-semibold text-[var(--ink)]">{school.name}</div>
                              <div className="mt-0.5 text-sm text-[var(--ink-muted)]">
                                {school.detail}
                              </div>
                            </div>
                            <span
                              aria-hidden="true"
                              className="mt-0.5 text-[var(--harbor)] transition-transform group-hover:translate-x-0.5"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <SectionHeader
                eyebrow="Watch"
                title="Scores"
                description="Live and upcoming — UVA stays pinned when it matters."
              />
              <ScoresBanner />
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <PersonalCardGrid cards={personalCards} />
          </ScrollReveal>

          <ScrollReveal>
            <FamilySection />
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 pb-16 pt-10 sm:pt-12">
        <FadeIn delay={0}>
          <SponsorRotator sponsors={sponsors} visibleCount={2} intervalMs={8000} />
        </FadeIn>

        <FadeIn delay={0.05}>
          <HomeHeroSection />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <WeatherCard />
            </div>
            <div className="md:col-span-2">
              <ScoresBanner />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <LatestVibesSection />
        </FadeIn>

        <FadeIn delay={0.2}>
          <FeaturedProjectsSection />
        </FadeIn>

        <FadeIn delay={0.25}>
          <VibeOfTheDay />
        </FadeIn>
      </div>
    </div>
  );
}
