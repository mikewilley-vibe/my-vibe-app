"use client";

import Image from "next/image";
import { useState } from "react";
import type { Concert } from "@/lib/concerts/types";

function fmt(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConcertCard({ concert }: { concert: Concert }) {
  const when = fmt(concert.dateTime);
  const where = [concert.venue, concert.city, concert.state].filter(Boolean).join(" • ");

  return (
    <a
      href={concert.url}
      target="_blank"
      rel="noreferrer"
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      title="Open tickets"
    >
      {concert.image ? (
        <div className="relative h-40 w-full bg-slate-100">
          <Image
            src={concert.image?.startsWith("/") || concert.image?.startsWith("http") ? concert.image : `/${concert.image}`}
            alt={concert.name}
            fill
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement | null;
              /* next/image's onError receives a SyntheticEvent where currentTarget is the underlying IMG; set a placeholder by changing src attribute */
              if (img) img.src = "/images/placeholder.svg";
            }}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}

      <div className="p-4 space-y-2">
        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
          {concert.name}
        </div>

        {when ? <div className="text-xs text-slate-600">{when}</div> : null}
        {where ? <div className="text-xs text-slate-600">{where}</div> : null}

        {typeof concert.priceMin === "number" || typeof concert.priceMax === "number" ? (
          <div className="text-xs text-slate-500">
            {concert.priceMin && concert.priceMax && concert.priceMin !== concert.priceMax
              ? `$${concert.priceMin.toFixed(0)}–$${concert.priceMax.toFixed(0)}`
              : `$${(concert.priceMin ?? concert.priceMax ?? 0).toFixed(0)}+`}
          </div>
        ) : null}
      </div>
    </a>
  );
}