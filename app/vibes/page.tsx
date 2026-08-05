"use client";

import { useMemo, useState } from "react";
import { getVibesNewestFirst } from "../data/vibes";
import { VibeGrid, TagFilterAccordion } from "@/app/components/vibes";
import { PageHeader } from "@/app/components/ui";
import VibeTimeline from "@/app/components/vibes/VibeTimeline";

export default function VibesPage() {
  const posts = useMemo(() => getVibesNewestFirst(), []);
  const latest = useMemo(() => posts.slice(0, 6), [posts]);

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
    <div className="min-h-screen pb-16">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <PageHeader
          eyebrow="Vibe Log"
          title="Build log & learning notes"
          description="Short snapshots of what I’ve been building, breaking, and learning."
        />

        <div className="mt-2">
          <VibeTimeline posts={latest} />
        </div>

        <TagFilterAccordion
          allTags={allTags}
          selectedTag={selectedTag}
          onSelect={setSelectedTag}
          countLabel={filteredPosts.length}
          className="mt-8"
        />

        {filteredPosts.length === 0 ? (
          <p className="mt-10 text-sm text-[var(--ink-muted)]">
            No vibes match that tag yet.
          </p>
        ) : (
          <div className="mt-8">
            <VibeGrid posts={filteredPosts} selectedTag={selectedTag} />
          </div>
        )}
      </section>
    </div>
  );
}
