"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";
import FeaturedProjectsSection from "@/app/components/content/FeaturedProjectsSection";
import HomeHeroSection from "@/app/components/hero/HomeHeroSection";
import { isPersonalMode } from "@/lib/appConfig";

const personalCards = [
  { title: "UVA", emoji: "🏀", href: "/uva", color: "from-blue-500 to-blue-600" },
  { title: "UVA Football", emoji: "🏈", href: "/uva/football", color: "from-orange-500 to-orange-600" },
  { title: "UVA Basketball", emoji: "🏀", href: "/uva/basketball", color: "from-blue-500 to-indigo-600" },
  { title: "Shows", emoji: "🎸", href: "/shows", color: "from-purple-500 to-pink-600" },
  { title: "Girl Scouts", emoji: "🍪", href: "https://bea-troop-site.vercel.app/", color: "from-green-500 to-emerald-600" },
  { title: "Orchard House", emoji: "🏀", href: "https://www.orchardhousebasketball.org/", color: "from-amber-500 to-orange-600" },
  { title: "HIIT Timer", emoji: "⏱️", href: "/workout-timer", color: "from-red-500 to-rose-600" },
  { title: "Local Sausage", emoji: "🌭", href: "https://local-sausage.vercel.app/", color: "from-yellow-500 to-amber-600" },
];

function PersonalHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <FadeIn delay={0}>
          <h1 className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome Back
          </h1>
          <p className="mb-12 text-lg text-slate-600">Quick access to your favorite apps and utilities</p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalCards.map((card, index) => (
            <FadeIn key={card.href} delay={0.1 + index * 0.05}>
              <Link href={card.href}>
                <div className={`h-32 rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center group`}>
                  <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{card.emoji}</div>
                  <h3 className="font-bold text-lg">{card.title}</h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}

function PortfolioHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-lg text-gray-600">Content coming soon...</p>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-lg mb-4">If you see this, the page is rendering</p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-100 rounded">Personal Mode Content</div>
          <div className="p-4 bg-green-100 rounded">Portfolio Mode Content</div>
        </div>
      </div>
    </main>
  );
}