import Image from "next/image";

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

  return (
    <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl shadow-sm ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`${objectFit} ${objectPos}`}
      />
    </div>
  );
}