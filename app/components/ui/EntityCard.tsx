import Link from "next/link";

type EntityCardProps = {
  title: string;
  href: string;
  subtitle?: string;
  imageSrc?: string;
  fallbackImageSrc?: string;
};

export default function EntityCard({
  title,
  href,
  subtitle = "View →",
  imageSrc,
  fallbackImageSrc = "/images/concert-fallback.jpg",
}: EntityCardProps) {
  const src = (imageSrc ?? "").trim() ? imageSrc! : fallbackImageSrc;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-[var(--fog)] bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--harbor)]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--harbor)]/40"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--paper)] ring-1 ring-[var(--fog)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.endsWith(fallbackImageSrc)) return;
            img.src = fallbackImageSrc;
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[var(--ink)]">{title}</div>
        <div className="mt-0.5 text-xs text-[var(--ink-muted)] transition-colors group-hover:text-[var(--harbor)]">
          {subtitle}
        </div>
      </div>
    </Link>
  );
}
