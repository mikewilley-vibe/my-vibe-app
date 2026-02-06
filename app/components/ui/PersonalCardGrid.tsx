import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/app/components/motion/FadeIn";

export type PersonalCard = {
  title: string;
  subtitle?: string;
  emoji: string;
  href: string;
  color: string; // keep using "from-x via-y to-z"
  cta: string;
  image?: string; // optional image to use instead of emoji
};

export default function PersonalCardGrid({ cards }: { cards: PersonalCard[] }) {
  return (
    <div className="relative mb-16">
      {/* Asymmetric section background with gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl" />
      </div>

      {/* Section label */}
      <div className="mb-8">
        <p className="label-xs text-blue-600 uppercase mb-2">Quick Access</p>
        <h2 className="headline-lg text-slate-900">
          Your favorite apps & utilities
        </h2>
        <div className="mt-3 h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <FadeIn key={card.href} delay={0.35 + index * 0.08}>
            <Link href={card.href} className="block">
              <div
                className={`
                  group relative h-40 overflow-hidden rounded-2xl 
                  shadow-lg transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                  focus-within:ring-2 focus-within:ring-blue-400/60
                `}
              >
                {/* Background image - full coverage */}
                {card.image && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

                {/* Very light overlay for text readability */}
                {card.image && (
                  <div className="pointer-events-none absolute inset-0 bg-black/15" />
                )}

                {/* Content with premium spacing */}
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="text-5xl mb-3 origin-left transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                      {card.emoji}
                    </div>
                    <h3 className="font-bold text-lg text-white drop-shadow-md">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-sm text-white/95 drop-shadow-sm mt-1">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Simple CTA Button */}
                  <div className="self-start mt-auto inline-flex items-center gap-2 rounded-lg bg-black/30 hover:bg-black/40 px-4 py-2 text-xs font-semibold text-white drop-shadow-md transition-all duration-300">
                    {card.cta}
                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
