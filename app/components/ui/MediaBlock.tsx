"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MediaBlockProps = {
  src: string;
  alt: string;
  aspect?: string; // e.g. "aspect-[16/9]" or "aspect-square"
  priority?: boolean;
  fit?: "cover" | "contain";
  focus?: "center" | "top" | "bottom";
  className?: string;
};

export default function MediaBlock({
  src,
  alt,
  aspect = "aspect-[16/9]",
  priority = false,
  fit = "cover",
  focus = "center",
  className = "",
}: MediaBlockProps) {
  const objectFit = fit === "contain" ? "object-contain" : "object-cover";
  const objectPos =
    focus === "top" ? "object-top" : focus === "bottom" ? "object-bottom" : "object-center";

  const normalize = (s: string) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  // Avoid hydratation mismatch by starting with a safe placeholder on the server
  // and setting the actual src on the client.
  const [curSrc, setCurSrc] = useState<string>("/images/placeholder.svg");

  useEffect(() => {
    setCurSrc(normalize(src));
  }, [src]);

  return (
    <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl shadow-sm ${className}`}>
      <Image
        src={curSrc}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        onError={() => setCurSrc("/images/placeholder.svg")}
        className={`${objectFit} ${objectPos}`}
      />
    </div>
  );
}