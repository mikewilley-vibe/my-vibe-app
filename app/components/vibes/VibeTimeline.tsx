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
  const items = posts;

  return (
    <section className={className ?? ""}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Recent vibes</h2>
        <Link
          href="/vibes"
          className="text-sm font-medium text-[var(--harbor)] hover:underline"
        >
          Open log →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="relative mt-6">
            <div className="absolute left-0 right-0 top-3 h-px bg-[var(--fog)]" />

            <div className="grid grid-cols-6 gap-4">
              {items.slice(0, 6).map((p, idx) => (
                <motion.a
                  key={p.slug}
                  href={`/vibes/${p.slug}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.05 }}
                  className="group relative block rounded-2xl border border-[var(--fog)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--harbor)]/35 hover:shadow-md"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-3 w-3 rounded-full border-2 border-white bg-[var(--harbor)] shadow-sm" />
                  </div>

                  <div className="text-xs text-[var(--ink-muted)]">{formatShort(p.date)}</div>

                  <h3 className="mt-1 text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--harbor)] line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs text-[var(--ink-muted)] line-clamp-3">{p.summary}</p>

                  <span className="mt-3 inline-block text-xs font-semibold text-[var(--harbor)]">
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
