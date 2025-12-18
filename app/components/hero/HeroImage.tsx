import Image from "next/image";

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
  return (
    <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl shadow-sm`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        priority={priority}
      />
    </div>
  );
}