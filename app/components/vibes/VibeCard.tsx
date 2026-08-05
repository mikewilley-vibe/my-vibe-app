"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { VibePost } from "@/app/data/vibes";

type Props = {
  post: VibePost;
  isNew?: boolean;
  className?: string;
};

function formatVibeDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function VibeCard({ post, isNew = false, className }: Props) {
  const prettyDate = useMemo(() => formatVibeDate(post.date), [post.date]);

  return (
    <details
      className={
        "group rounded-2xl border border-[var(--fog)] bg-white/90 px-4 py-3 shadow-sm transition hover:border-[var(--harbor)]/35 " +
        (className ?? "")
      }
    >
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
              <span className="rounded-lg bg-[var(--paper)] px-2 py-0.5 font-medium">
                {prettyDate}
              </span>

              {isNew && (
                <span className="rounded-lg bg-[var(--signal)]/10 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--signal)]">
                  New
                </span>
              )}
            </div>

            <h2 className="mt-2 font-display text-base font-semibold text-[var(--ink)]">
              {post.title}
            </h2>

            <p className="mt-1 text-sm text-[var(--ink-muted)]">{post.summary}</p>
          </div>

          <span
            aria-hidden="true"
            className="mt-1 shrink-0 text-[var(--harbor)] transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </div>
      </summary>

      <div className="mt-4 border-t border-[var(--fog)] pt-4 text-sm text-[var(--ink-muted)] whitespace-pre-wrap">
        {post.message}

        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-lg border border-[var(--fog)] bg-[var(--paper)] px-2 py-0.5 text-[0.7rem] font-medium text-[var(--ink-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link
            href={`/vibes/${post.slug}`}
            className="text-xs font-semibold text-[var(--harbor)] hover:underline"
          >
            Open full post →
          </Link>
        </div>
      </div>
    </details>
  );
}
