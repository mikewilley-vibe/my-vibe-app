import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import AvatarHero from "@/app/components/hero/AvatarHero";

type Props = {
  title?: string;
  subtitle?: string;
  blurb?: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  footerNote?: string;
};

export default function HomeHeroSection({
  title = "Blending public-sector projects, accessibility, and financial chops ⚖️💻",
  subtitle = "Mike's Vibe Coder HQ",
  blurb = `I lead and ship digital projects for governments and agencies —
from DMV PODS to accessibility programs and payment portals.
This space is my home base for experiments, projects, and tracking the vibe.`,
  primaryCtaHref = "/projects",
  primaryCtaLabel = "View projects",
  secondaryCtaHref = "/contact",
  secondaryCtaLabel = "Contact Mike",
  footerNote = "Currently coding in Richmond, VA · Next.js · TypeScript · Drupal · Smartsheet",
}: Props) {
  return (
    <FadeIn>
      <section className="flex flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {subtitle}
          </p>

          <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
            {title}
          </h1>

          <p className="max-w-xl whitespace-pre-line text-base text-slate-600">
            {blurb}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {primaryCtaLabel}
            </Link>

            <Link
              href={secondaryCtaHref}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white"
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          <p className="text-xs text-slate-500">{footerNote}</p>
        </div>

        {/* Avatar side */}
        {/* Avatar side */}
<div className="flex w-full flex-1 justify-center md:justify-end">
  <AvatarHero
    src="/images/mike-headshot.jpeg"
    alt="Mike Willey avatar"
    size="lg"
  />
</div>
      </section>
    </FadeIn>
  );
}