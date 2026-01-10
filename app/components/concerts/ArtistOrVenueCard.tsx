"use client";

import Image from "next/image";
import { useState } from "react";


type Props = {
  name: string;
  imageSrc: string;
  href: string;
  meta?: string; // "Artist" or "Venue • Richmond, VA"
};

export default function ArtistOrVenueCard({
  name,
  imageSrc,
  href,
  meta,
}: Props) {
  // Normalize image source and provide a fallback when the image 404s
  const normalizeSrc = (s: string | undefined) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  const [src, setSrc] = useState<string>(normalizeSrc(imageSrc));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group block rounded-2xl bg-white ring-1 ring-slate-200
        shadow-sm transition-all duration-200 ease-out
        hover:-translate-y-0.5 hover:shadow-md
      "
    >
      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={name}
            width={400}
            height={400}
            onError={() => setSrc("/images/placeholder.svg")}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-semibold text-slate-900">
            {name}
          </h3>
          {meta && (
            <p className="mt-0.5 text-xs text-slate-500">
              {meta}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}