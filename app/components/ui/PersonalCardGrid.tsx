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
                  border border-white/50
                  bg-white/15 backdrop-blur-3xl backdrop-saturate-150 backdrop-brightness-110
                  shadow-xl shadow-black/8 transition-all duration-300
                  hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/12
                  hover:border-white/70 hover:bg-white/25
                  focus-within:ring-2 focus-within:ring-blue-400/60
                  sheen-on-hover edge-highlight
                `}
                style={card.image ? {
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                } : undefined}
              >
                {/* Glass layer with enhanced blur */}
                <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-xl" />

                {/* Image overlay gradient */}
                {card.image && (
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
                )}

                {/* Tint layer with reduced opacity for glass effect */}
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${card.color} ${card.image ? "opacity-10" : "opacity-20"}`}
                />

                {/* Soft glow blobs on hover */}
                <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-white/60 blur-3xl opacity-0 transition-opacity duration-400 group-hover:opacity-20" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-white/50 blur-3xl opacity-0 transition-opacity duration-400 group-hover:opacity-15" />

                {/* Decorative emoji watermark */}
                <div className="pointer-events-none absolute top-2 right-4 select-none opacity-5 text-5xl transition-opacity duration-300 group-hover:opacity-10">
                  {card.emoji}
                </div>

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

                  {/* Premium CTA Button */}
                  <div className="self-start mt-auto inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/25 hover:bg-white/35 px-4 py-2 text-xs font-semibold text-white drop-shadow-md backdrop-blur-lg transition-all duration-300 group-hover:border-white/80 group-hover:shadow-md">
                    {card.cta}
                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                {/* Top shimmer line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Bottom sheen line */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
