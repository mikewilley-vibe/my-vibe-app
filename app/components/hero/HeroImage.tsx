"use client";

import Image from "next/image";
import { useState } from "react";

type HeroImageProps = {
  src: string;
  alt: string;
  aspect?: string; // e.g. "aspect-[16/9]"
  priority?: boolean;
};

export default function HeroImage({
  src,
  alt,
  aspect = "aspect-[16/9]",
  priority = false,
}: HeroImageProps) {
  const normalize = (s: string) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  const [curSrc, setCurSrc] = useState<string>(normalize(src));

  return (
    <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl shadow-sm`}>
      <Image
        src={curSrc}
        alt={alt}
        fill
        onError={() => setCurSrc("/images/placeholder.svg")}
        className="object-cover object-top"
        priority={priority}
      />
    </div>
  );
}