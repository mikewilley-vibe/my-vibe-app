"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

export default function AvatarHero({
  src,
  alt,
  size = "md",
}: Props) {
  const sizeClasses = {
    sm: "h-28 w-28",
    md: "h-40 w-40",
    lg: "h-100 w-100",
  };

  const normalize = (s: string) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  const [curSrc, setCurSrc] = useState<string>(normalize(src));

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br
      from-blue-500 via-indigo-500 to-sky-400 shadow-lg shadow-blue-500/40
      ${sizeClasses[size]}`}
    >
      <Image
        src={curSrc}
        alt={alt}
        fill
        onError={() => setCurSrc("/images/placeholder.svg")}
        className="object-cover object-top"
        priority
      />
    </div>
  );
}