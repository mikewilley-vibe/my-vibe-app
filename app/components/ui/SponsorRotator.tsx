"use client";

import { useEffect, useMemo, useState } from "react";
import type { Sponsor } from "@/app/data/sponsors";
import SponsorCard from "@/app/components/ui/SponsorCard";

type Props = {
  sponsors: Sponsor[];
  visibleCount?: number; // default 2
  intervalMs?: number; // default 7000
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function SponsorRotator({
  sponsors,
  visibleCount = 2,
  intervalMs = 7000,
}: Props) {
  const [start, setStart] = useState(0);

  const visible = useMemo(() => {
    const list = Array.isArray(sponsors) ? sponsors : [];
    if (list.length <= visibleCount) return list;

    const out: Sponsor[] = [];
    for (let i = 0; i < visibleCount; i++) {
      out.push(list[mod(start + i, list.length)]);
    }
    return out;
  }, [sponsors, start, visibleCount]);

  useEffect(() => {
    if (!sponsors?.length) return;
    if (sponsors.length <= visibleCount) return;

    const t = setInterval(() => {
      setStart((s) => s + 1); // rotate one-at-a-time for 3 items
    }, intervalMs);

    return () => clearInterval(t);
  }, [sponsors, visibleCount, intervalMs]);

  return (
    <div className="mt-2">
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((s) => (
          <div key={s.id} className="min-h-[140px] animate-fadeIn">
            {/* min-h forces same visual height */}
            <SponsorCard sponsor={s} />
          </div>
        ))}
      </div>
    </div>
  );
}