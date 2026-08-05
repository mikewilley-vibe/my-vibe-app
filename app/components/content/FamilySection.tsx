import Image from "next/image";
import { BrandBadgeLink } from "@/app/components/ui";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function FamilySection() {
  return (
    <section>
      <SectionHeader
        eyebrow="Home"
        title="Family"
        description="The reason the calendar is full and the shortcuts matter."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-5 space-y-5">
          <p className="text-[var(--ink-muted)] leading-relaxed">
            Family is a huge part of my life outside of work and side projects. I love finding
            ways to support my kids&apos; creativity, curiosity, and confidence — whether that&apos;s
            building something together or showing up on the court.
          </p>

          <p className="text-[var(--ink-muted)] leading-relaxed">
            Jen and I got married in 2023 and she is amazing. She&apos;s an owner of Nusbaum Insurance
            and is great at what she does.
          </p>

          <BrandBadgeLink
            href="https://nusbauminsurance.com/"
            logoSrc="/images/Nusbaum-Insurance-Agency-Logo-800.png"
            alt="Nusbaum Insurance"
          />

          <p className="font-display text-xl text-[var(--ink)] leading-snug">
            Meeting her is the best thing that ever happened to me.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-[var(--fog)]">
            <Image
              src="/images/grain.jpeg"
              alt="Mike and Jen"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-[var(--fog)]">
            <Image
              src="/images/jen.jpeg"
              alt="Jen"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-[var(--fog)]">
            <Image
              src="/images/pier.JPG"
              alt="On the pier"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
