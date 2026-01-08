import { Section, BrandBadgeLink, ImageGrid, Subsection } from "@/app/components/ui";
import HeroImage from "@/app/components/hero/HeroImage";
export default function FamilySection() {
  return (
    <Section title="Family">
     <div className="relative inline-block">
      </div> <HeroImage
        src="/images/ptown.jpeg"
        alt="Mike with his family"
        priority
        
      />

      <p className="text-slate-700">
        Family is a huge part of my life outside of work and side projects. I love finding
        ways to support my kids&apos; creativity, curiosity, and confidence — whether that&apos;s
        building something together or showing up on the court.
      </p>

      <p className="text-slate-700">
        Jen and I got married in 2023 and she is amazing. She&apos;s an owner of Nusbaum Insurance
        and is great at what she does. If you want to know more about them:
      </p>

      <BrandBadgeLink
        href="https://nusbauminsurance.com/"
        logoSrc="/images/Nusbaum-Insurance-Agency-Logo-800.png"
        alt="Nusbaum Insurance"
      />

      <p className="mt-3 text-slate-700">
        Meeting her is the best thing that ever happened to me.
      </p>

      <ImageGrid
  gapClassName="gap-3"
  images={[
    {
      src: "/images/grain.jpeg",
      alt: "Mike and Jen",
      aspect: "aspect-square",
      objectClassName: "object-cover object-top",
    },
    {
      src: "/images/jen.jpeg",
      alt: "Jen",
      aspect: "aspect-square",
      objectClassName: "object-cover object-top",
    },
    {
      src: "/images/pier.JPG",
      alt: "Pier",
      aspect: "aspect-[16/9]",
      objectClassName: "object-cover",
    },
  ]}
/>

   
    </Section>
  );
}