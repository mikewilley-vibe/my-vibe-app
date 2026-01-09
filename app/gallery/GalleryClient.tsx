"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo, Tag } from "./page";

type Filter = "all" | Tag;

const TAG_LABELS: Record<Tag, string> = {
  people: "People",
  travel: "Travel",
  sports: "Sports",
  other: "Other",
};

type Props = {
  initialPhotos: Photo[];
};

export default function GalleryClient({ initialPhotos }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Photo | null>(null);

  const filteredPhotos =
    activeFilter === "all"
      ? initialPhotos
      : initialPhotos.filter((p) => p.tags.includes(activeFilter));

  // ESC closes lightbox
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Photo Gallery
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Images pulled automatically from <code>/public/gallery</code>.
              Click any photo for a closer look.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "All" },
                { key: "people", label: "People" },
                { key: "travel", label: "Travel" },
                { key: "sports", label: "Sports" },
                { key: "other", label: "Other" },
              ] as { key: Filter; label: string }[]
            ).map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition
                    ${
                      isActive
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                        : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid (masonry-style using CSS columns) */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-emerald-500/10"
            >
              <div className="relative w-full overflow-hidden">
                <div
                  className={
                    photo.aspect === "portrait"
                      ? "relative h-[280px]"
                      : photo.aspect === "square"
                      ? "relative h-[230px]"
                      : "relative h-[200px]"
                  }
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* gradient overlay bottom */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                </div>
              </div>

              {/* Meta */}
              <div className="relative z-10 -mt-16 px-4 pb-3 pt-6 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="line-clamp-1 text-sm font-semibold text-slate-50">
                    {photo.title}
                  </h2>
                  {photo.date && (
                    <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-slate-400">
                      {photo.date}
                    </span>
                  )}
                </div>

                {photo.location && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                    {photo.location}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-1">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-200"
                    >
                      {TAG_LABELS[tag]}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative mx-4 max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/95 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs text-slate-200 hover:bg-black"
              onClick={() => setSelected(null)}
            >
              Close
            </button>

            {/* Image */}
            <div className="relative h-[60vh] w-full bg-black">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="border-t border-slate-800 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {selected.title}
                  </h2>
                  {(selected.location || selected.date) && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {selected.location}
                      {selected.location && selected.date && " • "}
                      {selected.date}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-200"
                    >
                      {TAG_LABELS[tag]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}