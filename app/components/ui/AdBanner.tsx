// app/components/ui/AdBanner.tsx
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  sponsor: string;
  headline: string;
  copy: string;
  cta: string;
  href?: string;
  variant?: "slate" | "indigo" | "emerald";
  brand?: ReactNode; // 👈 NEW
};

const VARIANTS: Record<NonNullable<Props["variant"]>, { bg: string; ring: string; btn: string }> = {
  slate: {
    bg: "from-slate-900 via-slate-800 to-slate-700",
    ring: "ring-slate-300/40",
    btn: "bg-white text-slate-900 hover:bg-slate-100",
  },
  indigo: {
    bg: "from-indigo-900 via-indigo-800 to-indigo-700",
    ring: "ring-indigo-300/40",
    btn: "bg-white text-indigo-900 hover:bg-indigo-50",
  },
  emerald: {
    bg: "from-emerald-900 via-emerald-800 to-emerald-700",
    ring: "ring-emerald-300/40",
    btn: "bg-white text-emerald-900 hover:bg-emerald-50",
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
}: Props) {
  const v = VARIANTS[variant];

  return (
    <div
  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${v.bg} p-5 shadow-sm ring-1 ${v.ring}
  opacity-0 translate-y-2 animate-[fadeInUp_0.6s_ease-out_forwards]`}
>
      <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-90px] left-[-90px] h-56 w-56 rounded-full bg-white/10 blur-2xl" />

<div className="flex items-start gap-4">
  <div className="shrink-0">
    {brand ?? (
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
        <span className="text-sm font-black">
          {sponsor.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )}
  </div>

  <div className="min-w-0">
    <h3 className="text-base font-extrabold text-white leading-snug">
      {headline}
    </h3>
    <p className="mt-1 text-sm leading-relaxed text-white/90">
      {copy}
    </p>
    <p className="mt-1 text-[11px] text-white/70">{sponsor}</p>
  </div>
</div>

<div className="mt-auto">
  <Link
    href={href}
    className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition ${v.btn}`}
  >
    {cta} <span aria-hidden className="ml-1">→</span>
  </Link>
</div>
        
        </div>
    
  
  );
}