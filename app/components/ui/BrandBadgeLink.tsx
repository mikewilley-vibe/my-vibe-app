"use client";

import Image from "next/image";
import { useState } from "react";

type BrandBadgeLinkProps = {
  href: string;
  logoSrc: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function BrandBadgeLink({
  href,
  logoSrc,
  alt,
  width = 200,
  height = 48,
}: BrandBadgeLinkProps) {
  const normalize = (s: string) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  const [src, setSrc] = useState<string>(normalize(logoSrc));

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center mt-3 transition-all duration-300
                  hover:opacity-100 opacity-80
                 hover:scale-[1.02]"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={() => setSrc("/images/placeholder.svg")}
        className="h-10 w-auto"
      />
    </a>
  );
}