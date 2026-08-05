"use client";

import { motion } from "framer-motion";

const focusAreas = [
  "Project Management",
  "Public-Sector Web",
  "Finance & Analytics",
];

export default function IntroSection() {
  return (
    <section className="space-y-8 py-2">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label-xs mb-3">About</p>
        <h1 className="headline-xl">Mike Willey</h1>
        <div className="accent-rule" />
      </motion.div>

      <motion.div
        className="space-y-5 max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-lg md:text-xl leading-relaxed text-[var(--ink-muted)]">
          I&apos;m an accountant and a project manager for a large tech firm focused on the
          public sector.{" "}
          <span className="font-semibold text-[var(--ink)]">During the day</span> I help
          partners with websites and payments while balancing budgets.{" "}
          <span className="font-semibold text-[var(--ink)]">At night</span> I&apos;m learning
          to code and building my own tools.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-[var(--ink-muted)] border-l-2 border-[var(--harbor)] pl-4">
          This HQ is where I document the journey from{" "}
          <span className="font-semibold text-[var(--ink)]">&quot;power user&quot;</span> to
          developer — one project, one note, one vibe at a time.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        {focusAreas.map((label) => (
          <span
            key={label}
            className="rounded-lg border border-[var(--fog)] bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--ink)]"
          >
            {label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
