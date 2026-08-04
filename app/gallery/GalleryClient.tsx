"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import type { Photo, Tag } from "./page";

type Filter = "all" | Tag;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "people", label: "People" },
  { key: "travel", label: "Travel" },
  { key: "sports", label: "Sports" },
  { key: "other", label: "Other" },
];

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
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Photo | null>(null);

  const filteredPhotos =
    activeFilter === "all"
      ? initialPhotos
      : initialPhotos.filter((p) => p.tags.includes(activeFilter));

  useEffect(() => {
    if (!selected) return;

    lastFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
      lastFocusRef.current?.focus();
    };
  }, [selected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
                <ImageIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Visuals
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Photo gallery
                </h1>
              </div>
            </div>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              A collection of people, travel, and sports moments. Click any photo
              for a closer look.
            </p>
          </div>

          <div
            role="toolbar"
            aria-label="Filter photos"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(key)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        {initialPhotos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">No photos yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Add images to the gallery folder to populate this page.
            </p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No photos in {TAG_LABELS[activeFilter as Tag] ?? "this filter"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Try another filter, or switch back to All.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Show all photos
            </button>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelected(photo)}
                className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                </div>

                <div className="relative z-10 -mt-14 px-4 pb-4 pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="line-clamp-1 text-sm font-semibold text-white drop-shadow">
                      {photo.title}
                    </h2>
                    {photo.date && (
                      <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-white/80">
                        {photo.date}
                      </span>
                    )}
                  </div>

                  {photo.location && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">
                      {photo.location}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                      >
                        {TAG_LABELS[tag]}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative mx-auto max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setSelected(null)}
              aria-label="Close photo"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Close
            </button>

            <div className="relative h-[55vh] w-full bg-slate-100 sm:h-[60vh]">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id={titleId} className="text-base font-semibold text-slate-900">
                    {selected.title}
                  </h2>
                  {(selected.location || selected.date) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {[selected.location, selected.date].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
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
    </div>
  );
}
