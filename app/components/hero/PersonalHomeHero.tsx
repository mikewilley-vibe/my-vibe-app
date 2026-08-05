"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WeatherCard from "@/app/components/weather/WeatherCard";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function PersonalHomeHero() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    setGreeting(greetingForHour(now.getHours()));
    setDateLabel(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <section className="relative isolate min-h-[min(88vh,760px)] overflow-hidden bg-[var(--ink)] text-white">
      <Image
        src="/images/ptown.jpeg"
        alt="Family on the water"
        fill
        priority
        className="object-cover object-[center_30%] opacity-75"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/90 via-[var(--ink)]/55 to-[var(--ink)]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/25" />

      <div className="relative z-10 mx-auto flex min-h-[min(88vh,760px)] max-w-6xl flex-col justify-between px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl space-y-4 pt-4 sm:pt-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Mike&apos;s Vibe HQ
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            {greeting}.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {dateLabel ? (
              <span className="font-medium text-white">{dateLabel}</span>
            ) : null}
            {dateLabel ? " — " : ""}
            Calendar, scores, and the shortcuts that keep the household moving.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="w-full max-w-md">
            <WeatherCard variant="strip" locationLabel="Norfolk / Richmond" />
          </div>

          <Link
            href="#today"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--signal)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Jump to calendar
            <span aria-hidden="true">↓</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
