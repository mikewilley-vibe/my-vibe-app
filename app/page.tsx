"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
        <h1 className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Welcome Back
        </h1>
        <p className="mb-12 text-lg text-slate-600">Quick access to your favorite apps and utilities</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className={`h-32 rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center group`}>
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{card.emoji}</div>
                <h3 className="font-bold text-lg">{card.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function PortfolioHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Mike Willey
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Full-stack developer • Creative technologist • Building cool stuff on the internet
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/projects" className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold mb-2">Projects</h2>
            <p className="text-slate-600">Check out what I've built</p>
          </Link>
          <Link href="/vibes" className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold mb-2">Vibes</h2>
            <p className="text-slate-600">My thoughts and learnings</p>
          </Link>
          <Link href="/about" className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold mb-2">About</h2>
            <p className="text-slate-600">Learn more about me</p>
          </Link>
          <Link href="/contact" className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold mb-2">Contact</h2>
            <p className="text-slate-600">Get in touch</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  const [isPersonal, setIsPersonal] = useState<boolean | null>(null);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  // Show portfolio mode until we detect the actual mode
  if (isPersonal === null) {
    return <PortfolioHome />;
  }

  return isPersonal ? <PersonalHome /> : <PortfolioHome />;
}