"use client";

import { useMemo, useState } from "react";
import { getVibesNewestFirst } from "../data/vibes";
import { VibeGrid, TagFilterAccordion } from "@/app/components/vibes";
import { PageHeader } from "@/app/components/ui";
import VibeTimeline from "@/app/components/vibes/VibeTimeline";

export default function VibesPage() {
  // newest first
  const posts = useMemo(() => getVibesNewestFirst(), []);

  // timeline items (top 6)
  const latest = useMemo(() => posts.slice(0, 6), [posts]);

  // collect tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const [selectedTag, setSelectedTag] = useState<string | "all">("all");

  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) => post.tags?.includes(selectedTag));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-16">
        <PageHeader
          eyebrow="Vibe Log"
          title="Build log & learning notes"
          description="Short snapshots of what I’ve been building, breaking, and learning as I become a vibe coder."
        />

        {/* Timeline */}
        <div className="mt-8">
          <VibeTimeline posts={latest} />
        </div>

        <TagFilterAccordion
          allTags={allTags}
          selectedTag={selectedTag}
          onSelect={setSelectedTag}
          countLabel={filteredPosts.length}
          className="mt-6"
        />

        {/* Grid */}
        {filteredPosts.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
            No vibes match that tag yet. Time to create a new one. ✏️
          </p>
        ) : (
          <div className="mt-10">
            <VibeGrid posts={filteredPosts} selectedTag={selectedTag} />
          </div>
        )}
      </section>
    </main>
  );
}