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
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((artist) => (
          <div key={artist.name} className="min-h-[300px] animate-fadeIn">
            <Link
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-lg shadow-md transition hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-full w-full bg-slate-200">
                {artist.image && (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                      {artist.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
