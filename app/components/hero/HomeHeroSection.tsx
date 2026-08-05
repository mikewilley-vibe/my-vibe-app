import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import AvatarHero from "@/app/components/hero/AvatarHero";
import PremiumButton from "@/app/components/ui/PremiumButton";
import StatusBadge from "@/app/components/ui/StatusBadge";

type Props = {
  title?: string;
  subtitle?: string;
  blurb?: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  tertiaryCtaHref?: string;
  tertiaryCtaLabel?: string;
  footerNote?: string;
};

export default function HomeHeroSection({
  title = "Mike's Vibe HQ",
  subtitle = "Project management, public-sector web, and night-shift code",
  blurb = "Home base for experiments, shipped work, and notes from the journey into building software.",
  primaryCtaHref = "/projects",
  primaryCtaLabel = "View projects",
  secondaryCtaHref = "/about",
  secondaryCtaLabel = "About Mike",
  tertiaryCtaHref = "/contact",
  tertiaryCtaLabel = "Contact",
  footerNote = "Richmond, VA · Next.js · TypeScript · Drupal · Smartsheet",
}: Props) {
  return (
    <FadeIn>
      <section className="relative py-4 sm:py-8">
        <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
          <div className="flex-1 space-y-5">
            <StatusBadge label="Actively Coding" status="live" size="sm" />

            <div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--ink)]">
                {title}
              </h1>
              <div className="accent-rule" />
            </div>

            <p className="text-base sm:text-lg font-medium text-[var(--harbor)] max-w-xl">
              {subtitle}
            </p>

            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-xl">
              {blurb}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <PremiumButton
                href={primaryCtaHref}
                label={primaryCtaLabel}
                variant="primary"
                size="md"
              />
              <PremiumButton
                href={secondaryCtaHref}
                label={secondaryCtaLabel}
                variant="secondary"
                size="md"
              />
              <PremiumButton
                href={tertiaryCtaHref}
                label={tertiaryCtaLabel}
                variant="tertiary"
                size="md"
              />
            </div>

            <p className="text-xs text-[var(--ink-muted)] tracking-wide pt-1">{footerNote}</p>
          </div>

          <div className="flex w-full flex-1 justify-center md:justify-end">
            <AvatarHero
              src="/images/mike-headshot.jpeg"
              alt="Mike Willey avatar"
              size="lg"
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
