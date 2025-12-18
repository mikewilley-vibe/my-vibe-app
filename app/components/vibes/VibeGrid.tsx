"use client";

import FadeIn from "@/app/components/motion/FadeIn";
import VibeCard from "./VibeCard";
import type { VibePost } from "@/app/data/vibes";

type Props = {
  posts: VibePost[];
  selectedTag?: string | "all";
  className?: string;
};

export default function VibeGrid({ posts, selectedTag = "all", className }: Props) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className ?? ""}`}>
      {posts.map((v, index) => (
        <FadeIn key={v.slug ?? v.title} delay={index * 0.06}>
         <VibeCard post={v} isNew={selectedTag === "all" && index === 0} />
        </FadeIn>
      ))}
    </div>
  );
}