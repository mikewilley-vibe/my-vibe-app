"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { VibePost } from "@/app/data/vibes";

type Props = {
  posts: VibePost[];
  className?: string;
};

function formatShort(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function VibeTimeline({ posts, className }: Props) {
  // newest first → left to right (newest on left)
  const items = posts;

  return (
    <section className={className ?? ""}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Recent vibes
        </h2>
        <Link
          href="/vibes"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open Vibe Log →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          {/* line */}
          <div className="relative mt-6">
            <div className="absolute left-0 right-0 top-3 h-px bg-slate-200 dark:bg-slate-700" />

            <div className="grid grid-cols-6 gap-4">
              {items.slice(0, 6).map((p, idx) => (
                <motion.a
                  key={p.slug}
                  href={`/vibes/${p.slug}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.06 }}
                  className="group relative block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* dot */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm dark:border-slate-900" />
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatShort(p.date)}
                  </div>

                  <div className="mt-1 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-50 line-clamp-2">
                      {p.title}
                    </h3>
                    <span className="shrink-0 text-lg">{p.emoji}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {p.summary}
                  </p>

                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    Read →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}