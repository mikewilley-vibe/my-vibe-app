import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import SectionHeader from "@/app/components/ui/SectionHeader";

export type PersonalCard = {
  title: string;
  subtitle?: string;
  href: string;
  cta: string;
  image?: string;
  featured?: boolean;
};

export default function PersonalCardGrid({ cards }: { cards: PersonalCard[] }) {
  const [primary, ...rest] = [...cards].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  if (!primary) return null;

  const side = rest.slice(0, 2);
  const bottom = rest.slice(2);

  return (
    <section>
      <SectionHeader
        eyebrow="Go"
        title="Launchpad"
        description="Jump into the apps and sites you actually use this week."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:min-h-[380px]">
          <div className="lg:col-span-2 lg:row-span-2">
            <FadeIn delay={0.04}>
              <LaunchCard card={primary} tall />
            </FadeIn>
          </div>

          {side.map((card, index) => (
            <div key={card.href}>
              <FadeIn delay={0.08 + index * 0.05}>
                <LaunchCard card={card} />
              </FadeIn>
            </div>
          ))}
        </div>

        {bottom.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {bottom.map((card, index) => (
              <FadeIn key={card.href} delay={0.12 + index * 0.05}>
                <LaunchCard card={card} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LaunchCard({
  card,
  tall = false,
}: {
  card: PersonalCard;
  tall?: boolean;
}) {
  return (
    <Link href={card.href} className="block group h-full">
      <div
        className={[
          "relative overflow-hidden rounded-2xl ring-1 ring-[var(--fog)] transition duration-300",
          "group-hover:-translate-y-0.5 group-hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-[var(--harbor)]/40",
          tall ? "min-h-[280px] lg:min-h-[380px] h-full" : "min-h-[170px] h-full",
        ].join(" ")}
      >
        {card.image && (
          <div
            className="absolute inset-0 scale-100 transition duration-700 group-hover:scale-[1.04]"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/30 to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
          <h3
            className={[
              "font-display font-semibold text-white drop-shadow-sm",
              tall ? "text-2xl sm:text-3xl" : "text-xl",
            ].join(" ")}
          >
            {card.title}
          </h3>
          {card.subtitle && (
            <p className="mt-1 text-sm text-white/80 max-w-md">{card.subtitle}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-wide text-white/90">
            {card.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
