"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { vibePosts, type VibePost } from "@/app/data/vibes";

function todayKey() {
  // local time is fine for “vibe of the day”
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function pickRandom(posts: VibePost[]) {
  return posts[Math.floor(Math.random() * posts.length)];
}

export default function VibeOfTheDay() {
  const [slug, setSlug] = useState<string | null>(null);

  const post = useMemo(() => {
    if (!slug) return null;
    return vibePosts.find((p) => p.slug === slug) ?? null;
  }, [slug]);

  useEffect(() => {
    const key = `vibeOfTheDay:${todayKey()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setSlug(saved);
      return;
    }
    const p = pickRandom(vibePosts);
    localStorage.setItem(key, p.slug);
    setSlug(p.slug);
  }, []);

  function reroll() {
    const key = `vibeOfTheDay:${todayKey()}`;
    const p = pickRandom(vibePosts);
    localStorage.setItem(key, p.slug);
    setSlug(p.slug);
  }

  if (!post) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vibe of the day
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">
            <span className="mr-2">{post.emoji}</span>
            {post.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{post.summary}</p>
        </div>

        <button
          type="button"
          onClick={reroll}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        >
          Reroll
        </button>
      </div>

      <div className="mt-4">
        <Link
          href={`/vibes/${post.slug}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Open it →
        </Link>
      </div>
    </section>
  );
}