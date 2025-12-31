import AdBanner from "@/app/components/ui/AdBanner";
import BrandBadgeLink from "@/app/components/ui/BrandBadgeLink";
import type { Sponsor } from "@/app/data/sponsors";

type Props = {
  sponsor: Sponsor;
};

export default function SponsorCard({ sponsor }: Props) {
  return (
    <AdBanner
      sponsor={sponsor.sponsor}
      headline={sponsor.headline}
      copy={sponsor.copy}
      cta={sponsor.cta}
      href={sponsor.href}
      variant={sponsor.variant}
      brand={
        sponsor.logoSrc ? (
          <BrandBadgeLink href={sponsor.href} logoSrc={sponsor.logoSrc} alt={sponsor.alt ?? sponsor.headline} />
        ) : undefined
      }
    />
  );
}