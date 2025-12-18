// app/components/VibeCard.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { VibePost } from "@/app/data/vibes";

type Props = {
  post: VibePost;
  isNew?: boolean;     // you decide in the parent
  className?: string;
};

function formatVibeDate(dateStr: string) {
  // Expecting YYYY-MM-DD (zero padded). If not, JS date parsing can be weird.
  // We force local parsing by appending T00:00:00.
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function VibeCard({ post, isNew = false, className }: Props) {
  const prettyDate = useMemo(() => formatVibeDate(post.date), [post.date]);

  return (
    <details
      className={
        "group rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition hover:border-blue-400 " +
        "dark:border-slate-700 dark:bg-slate-800/90 " +
        (className ?? "")
      }
    >
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-700">
                {prettyDate}
              </span>

              {isNew && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  New
                </span>
              )}
            </div>

            <h2 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">
              {post.title}
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {post.summary}
            </p>
          </div>

          <span className="text-2xl shrink-0 transition-transform group-open:rotate-180">
            {post.emoji}
          </span>
        </div>
      </summary>

      {/* Accordion body */}
      <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300 whitespace-pre-wrap">
        {post.message}

        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[0.7rem] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Optional: deep link to detail page if you have /vibes/[slug] */}
        <div className="mt-4">
          <Link
            href={`/vibes/${post.slug}`}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Open full post →
          </Link>
        </div>
      </div>
    </details>
  );
}