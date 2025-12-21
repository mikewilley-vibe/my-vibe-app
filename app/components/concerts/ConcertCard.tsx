"use client";

import Image from "next/image";
import FadeIn from "@/app/components/motion/FadeIn";
import type { Concert } from "@/lib/concerts/types";

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConcertCard({ concert }: { concert: Concert }) {
  const when = fmtDateTime(concert.dateTime);
  const where = [concert.venue, [concert.city, concert.state].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" • ");

  return (
    <FadeIn>
      <a
        href={concert.url}
        target="_blank"
        rel="noreferrer"
        className={[
          "group block",
          "rounded-2xl border border-slate-200 bg-white shadow-sm",
          "transition",
          "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        ].join(" ")}
        title="Open on Ticketmaster"
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {concert.image ? (
              <Image
                src={concert.image}
                alt={concert.name}
                fill
                sizes="112px"
                className="object-cover transition group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900">
                  {concert.name}
                </div>
                <div className="mt-0.5 line-clamp-1 text-sm text-slate-600">
                  {where}
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                {when || "TBA"}
              </span>
            </div>

            {(concert.priceMin != null || concert.priceMax != null) && (
              <div className="mt-2 text-xs text-slate-600">
                {concert.priceMin != null && concert.priceMax != null
                  ? `Tickets $${concert.priceMin}–$${concert.priceMax}`
                  : concert.priceMin != null
                  ? `Tickets from $${concert.priceMin}`
                  : `Tickets up to $${concert.priceMax}`}
              </div>
            )}
          </div>
        </div>
      </a>
    </FadeIn>
  );
}