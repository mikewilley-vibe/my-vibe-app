"use client";

import { useEffect, useMemo, useState } from "react";
import type { MyArtist } from "@/app/data/myArtists";
import Image from "next/image";
import Link from "next/link";

type Props = {
  artists: MyArtist[];
  visibleCount?: number;
  intervalMs?: number;
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function ArtistRotator({
  artists,
  visibleCount = 3,
  intervalMs = 6000,
}: Props) {
  const [start, setStart] = useState(0);

  const visible = useMemo(() => {
    const list = Array.isArray(artists) ? artists : [];
    if (list.length <= visibleCount) return list;

    const out: MyArtist[] = [];
    for (let i = 0; i < visibleCount; i++) {
      out.push(list[mod(start + i, list.length)]);
    }
    return out;
  }, [artists, start, visibleCount]);

  useEffect(() => {
    if (!artists?.length) return;
    if (artists.length <= visibleCount) return;

    const t = setInterval(() => {
      setStart((s) => s + 1);
    }, intervalMs);

    return () => clearInterval(t);
  }, [artists, visibleCount, intervalMs]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((artist) => (
        <Link
          key={`${artist.name}-${start}`}
          href={artist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block min-h-[280px] overflow-hidden rounded-2xl ring-1 ring-[var(--fog)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fadeIn"
        >
          <div className="absolute inset-0 bg-[var(--paper)]">
            {artist.image ? (
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            ) : null}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-xl font-semibold text-white">{artist.name}</h3>
            <span className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wide text-white/85 transition-transform group-hover:translate-x-0.5">
              View shows →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
