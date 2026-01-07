import Link from "next/link";

type EntityCardProps = {
  title: string;
  href: string;
  subtitle?: string;
  imageSrc?: string;
  fallbackImageSrc?: string; // optional override
};

export default function EntityCard({
  title,
  href,
  subtitle = "View →",
  imageSrc,
  fallbackImageSrc = "/images/concert-fallback.jpg",
}: EntityCardProps) {
  // If imageSrc is missing/blank, use fallback
  const src = (imageSrc ?? "").trim() ? imageSrc! : fallbackImageSrc;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        group flex items-center gap-4
        rounded-xl border border-slate-200 bg-white p-4
        shadow-sm transition
        hover:-translate-y-1 hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
      "
    >
      {/* Image / Initial */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            // If the provided image path 404s, fall back gracefully
            const img = e.currentTarget;
            if (img.src.endsWith(fallbackImageSrc)) return;
            img.src = fallbackImageSrc;
          }}
        />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </Link>
  );
}