"use client";

import Image from "next/image";
import { useState } from "react";

export type ImageItem = {
  src: string;
  alt: string;
  aspect?: string; // "aspect-[16/9]" or "aspect-square" etc.
  objectClassName?: string; // "object-cover object-top" etc.
};

type ImageGridProps = {
  images: ImageItem[];
  gapClassName?: string; // e.g. "gap-3"
};

export default function ImageGrid({ images, gapClassName }: ImageGridProps) {
  const gap = gapClassName ?? "gap-6";

  // 1 image: simple full-width
  if (images.length === 1) {
    const img = images[0];
    const normalize = (s: string) => {
      if (!s) return "/images/placeholder.svg";
      if (s.startsWith("http") || s.startsWith("/")) return s;
      return `/${s}`;
    };

    const [src, setSrc] = useState<string>(normalize(img.src));

    return (
      <div className={`grid grid-cols-1 ${gap}`}>
        <div
          className={`relative w-full ${img.aspect ?? "aspect-[16/9]"} overflow-hidden rounded-2xl shadow-sm`}
        >
          <Image
            src={src}
            alt={img.alt}
            fill
            onError={() => setSrc("/images/placeholder.svg")}
            className={img.objectClassName ?? "object-cover"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gap}`}>
      {images.map((img, idx) => {
        // If exactly 3 images, make the last one span both columns on desktop
        const spanBothOnMd = images.length === 3 && idx === 2;

        return (
          <div
            key={img.src}
            className={[
              "relative w-full overflow-hidden rounded-2xl shadow-sm",
              img.aspect ?? "aspect-[16/9]",
              spanBothOnMd ? "md:col-span-2" : "",
            ].join(" ")}
          >
            <InnerImage img={img} />
          </div>
        );
      })}
    </div>
  );
}

function InnerImage({ img }: { img: ImageItem }) {
  const normalize = (s: string) => {
    if (!s) return "/images/placeholder.svg";
    if (s.startsWith("http") || s.startsWith("/")) return s;
    return `/${s}`;
  };

  const [src, setSrc] = useState<string>(normalize(img.src));

  return (
    <Image
      src={src}
      alt={img.alt}
      fill
      onError={() => setSrc("/images/placeholder.svg")}
      className={img.objectClassName ?? "object-cover"}
    />
  );
}