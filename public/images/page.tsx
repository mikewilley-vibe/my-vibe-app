"use client";

import { useMemo, useState } from "react";
import { vibePosts } from "../../app/data/vibes";
import PageHeader from "@/app/components/ui/PageHeader";
import VibeGrid from "@/app/components/vibes/VibeGrid";
import TagFilterAccordion from "@/app/components/vibes/TagFilterAccordion";

export default function VibesPage() {
  // Sort newest first (by date string)
  const posts = useMemo(
    () => [...vibePosts].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );
  // Collect unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const [selectedTag, setSelectedTag] = useState<string | "all">("all");

  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) => post.tags?.includes(selectedTag));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <PageHeader
  eyebrow="Vibe Log"
  title="Build log & learning notes"
  description="Short snapshots of what I've been building, breaking, and learning as I become a vibe coder."
/>
       <TagFilterAccordion
  className="mt-6"
  allTags={allTags}
  selectedTag={selectedTag}
  onSelect={setSelectedTag}
  countLabel={filteredPosts.length}
/>
       {/* GRID */}
<div className="mt-10">
  {filteredPosts.length === 0 ? (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      No vibes match that tag yet. Time to create a new one. ✏️
    </p>
  ) : (
    <VibeGrid posts={filteredPosts} />
  )}
</div>
      </section>
    </main>
  );
}