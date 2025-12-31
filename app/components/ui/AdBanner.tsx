// app/components/ui/AdBanner.tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  sponsor: string;
  headline: string;
  copy: string;
  cta: string;
  href?: string;
  variant?: "slate" | "indigo" | "emerald" | "purple";
  brand?: ReactNode;
  className?: string;
};

const VARIANTS: Record<
  NonNullable<Props["variant"]>,
  { bg: string; ring: string; btn: string }
> = {
  slate: {
    bg: "from-slate-700 via-slate-600 to-slate-500",
    ring: "ring-slate-300/40",
    btn: "bg-white text-slate-900 hover:bg-slate-100",
  },
  indigo: {
    bg: "from-indigo-700 via-indigo-600 to-indigo-500",
    ring: "ring-indigo-300/40",
    btn: "bg-white text-indigo-900 hover:bg-indigo-50",
  },
  emerald: {
    bg: "from-emerald-700 via-emerald-600 to-emerald-500",
    ring: "ring-emerald-300/40",
    btn: "bg-white text-emerald-900 hover:bg-emerald-50",
  },
  purple: {
    bg: "from-purple-700 via-purple-600 to-purple-500",
    ring: "ring-purple-300/40",
    btn: "bg-white text-purple-900 hover:bg-purple-50",
  },
};

export default function AdBanner({
  sponsor,
  headline,
  copy,
  cta,
  href = "#",
  variant = "slate",
  brand,
  className = "",
}: Props) {
  const v = VARIANTS[variant];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl bg-gradient-to-r",
        v.bg,
        "p-3 shadow-sm ring-1",
        v.ring,
        "h-full min-h-[140px]", // consistent card height
        "opacity-0 translate-y-2 animate-[fadeInUp_0.6s_ease-out_forwards]",
        className,
      ].join(" ")}
    >
      {/* glow blobs */}
      <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-90px] left-[-90px] h-56 w-56 rounded-full bg-white/10 blur-2xl" />

      {/* ✅ Nusbaum-style layout */}
      <div className="relative flex h-full items-start gap-5">
        {/* left: logo + button stacked */}
        <div className="flex w-[150px] shrink-0 flex-col items-start gap-2">
          <div className="w-full">
            {brand ?? (
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                <span className="text-sm font-black">
                  {String(sponsor).slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <Link
            href={href}
            className={[
              "inline-flex items-center justify-center rounded-xl px-4 py-2",
              "text-sm font-extrabold shadow-sm transition",
              v.btn,
              "whitespace-nowrap",
            ].join(" ")}
          >
            {cta} <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>

        {/* right: text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-white leading-snug">
            {headline}
          </h3>

          <p className="mt-0.5 text-sm leading-relaxed text-white/90">{copy}</p>

          <p className="mt-0.5 text-[11px] text-white/70">{sponsor}</p>
        </div>
      </div>
    </div>
  );
}