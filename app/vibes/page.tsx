"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { vibePosts } from "../data/vibes";

export default function VibesPage() {
  // sort newest first
  const posts = useMemo(
    () => [...vibePosts].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );

  // collect all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const [selectedTag, setSelectedTag] = useState<string | "all">("all");

  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) => post.tags?.includes(selectedTag));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
          Vibe Log
        </p>

        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Build log & learning notes
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Short snapshots of what I&apos;ve been building, breaking, and
          learning as I become a vibe coder.
        </p>

        {/* Legend */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Newest vibes at the top</span>
        </div>

        {/* TAG FILTER BAR */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Filter by tag:</span>

          <button
            type="button"
            onClick={() => setSelectedTag("all")}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedTag === "all"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
                selectedTag === tag
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-10 relative">
          {/* vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

          <ul className="space-y-6">
            {filteredPosts.map((post, index) => (
              <li key={post.slug} className="relative pl-10">
                {/* dot */}
                <div className="absolute left-3 top-4 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-500 shadow-sm dark:border-slate-900" />

                <Link
                  href={`/vibes/${post.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm ring-offset-2 transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800/90"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-700">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {index === 0 && selectedTag === "all" && (
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

                      {/* TAGS under each post */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
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
                    </div>

                    <span className="text-2xl shrink-0">{post.emoji}</span>
                  </div>
                </Link>
              </li>
            ))}

            {filteredPosts.length === 0 && (
              <li className="pl-10 text-sm text-slate-500 dark:text-slate-400">
                No vibes match that tag yet. Time to create a new one. ✏️
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}