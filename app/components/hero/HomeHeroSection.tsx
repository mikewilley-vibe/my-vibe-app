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
 
  avatarSrc?: string;
  avatarAlt?: string;
  footerNote?: string;
};

export default function HomeHeroSection({
  title = "Blending project management and accounting ⚖️💻",
  subtitle = "Mike's Vibe Coder HQ",
  blurb = `This space is my home base for experiments, projects, and tracking the vibe.`,
  primaryCtaHref = "/projects",
  primaryCtaLabel = "View projects",
  secondaryCtaHref = "/about",
  secondaryCtaLabel = "About Mike",
  tertiaryCtaHref = "/contact",
  tertiaryCtaLabel = "Contact Mike",
 
  footerNote = "Currently coding in Richmond, VA · Next.js · TypeScript · Drupal · Smartsheet",
}: Props) {
  return (
    <FadeIn>
      <section className="relative py-8">
        {/* Premium radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
          {/* Left Content - Strong Hierarchy */}
          <div className="flex-1 space-y-6">
            {/* Status Badge */}
            <div>
              <StatusBadge label="Actively Coding" status="live" size="sm" />
            </div>

            {/* Headline with underline */}
            <div>
              <h1 className="headline-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 leading-tight">
                {title}
              </h1>
              <div className="mt-3 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </div>

            {/* Subtitle */}
            <p className="label-sm text-blue-600 uppercase">
              {subtitle}
            </p>

            {/* Blurb with better hierarchy */}
            <p className="text-lg text-slate-700 leading-relaxed max-w-xl font-normal">
              {blurb}
            </p>

            {/* CTA Buttons with proper spacing */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

            {/* Footer note with better typography */}
            <p className="text-xs text-slate-500 tracking-wide pt-2">{footerNote}</p>
          </div>

          {/* Right Side - Avatar with Premium Effects */}
          <div className="flex w-full flex-1 justify-center md:justify-end">
            <div className="relative">
              {/* Floating glow behind avatar */}
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
              <AvatarHero
                src="/images/mike-headshot.jpeg"
                alt="Mike Willey avatar"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}