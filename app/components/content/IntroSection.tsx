"use client";

import { motion } from "framer-motion";

type Chip = {
  label: string;
  className: string;
  icon?: string;
};

const chips: Chip[] = [
  {
    label: "Project Management",
    className:
      "rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md ring-1 ring-slate-800",
    icon: "📋",
  },
  {
    label: "Public-Sector Web",
    className:
      "rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md ring-1 ring-blue-400",
    icon: "🌐",
  },
  {
    label: "Finance & Analytics",
    className:
      "rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md ring-1 ring-amber-400",
    icon: "📊",
  },
];

export default function IntroSection() {
  return (
    <section className="space-y-8 py-4">
      {/* Main Heading with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
          About Mike
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mt-4" />
      </motion.div>

      {/* Bio with Animated Line */}
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <p className="text-lg md:text-xl leading-relaxed text-slate-700">
          I&apos;m an accountant and a project manager for a large tech firm that
          focuses on the public-sector. <span className="font-bold text-blue-700">During the day</span> I&apos;m helping partners with their websites
          and payments while balancing budgets. <span className="font-bold text-blue-700">At night</span> I&apos;m learning to code
          and building my own tools.
        </p>

        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4">
          This little HQ is where I&apos;m documenting the journey from
          <span className="font-semibold text-slate-900"> &quot;power user&quot; to developer</span> — one vibe at a time.
        </p>
      </motion.div>

      {/* Skills/Interests with Staggered Animation */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        {chips.map((chip, idx) => (
          <motion.span
            key={chip.label}
            className={chip.className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            {chip.icon && <span className="mr-1">{chip.icon}</span>}
            {chip.label}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}