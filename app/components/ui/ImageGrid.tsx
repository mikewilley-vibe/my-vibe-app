import Image from "next/image";

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
    return (
      <div className={`grid grid-cols-1 ${gap}`}>
        <div
          className={`relative w-full ${img.aspect ?? "aspect-[16/9]"} overflow-hidden rounded-2xl shadow-sm`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
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
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={img.objectClassName ?? "object-cover"}
            />
          </div>
        );
      })}
    </div>
  );
}