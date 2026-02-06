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
      {/* Optional: background wash behind the whole grid (helps glass pop) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <FadeIn key={card.href} delay={0.35 + index * 0.05}>
            <Link href={card.href} className="block">
              <div
                className={`
                  group relative h-40 overflow-hidden rounded-2xl border border-white/30
                  bg-white/18 backdrop-blur-2xl backdrop-saturate-200
                  shadow-lg shadow-black/5 transition-all
                  hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/10
                  focus-within:ring-2 focus-within:ring-blue-500/40
                `}
              >
                {/* Tint layer (your existing gradient), behind the glass */}
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${card.color} opacity-35`}
                />

                {/* Soft glow blobs */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/35 blur-2xl opacity-0 transition group-hover:opacity-100" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-white/25 blur-2xl opacity-0 transition group-hover:opacity-100" />

                {/* Decorative emoji watermark */}
                <div className="pointer-events-none absolute top-0 right-0 select-none opacity-10 text-6xl transition-opacity group-hover:opacity-20">
                  {card.image ? "" : card.emoji}
                </div>

                {/* Content */}
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="text-4xl mb-2 origin-left transition-transform group-hover:scale-125">
                      {card.image ? (
                        <Image 
                          src={card.image} 
                          alt={card.title}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        card.emoji
                      )}
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-sm text-slate-700/80">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* CTA (make it a div so you don't nest a button inside a Link) */}
                  <div className="self-start mt-auto inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/22 px-4 py-2 text-sm font-semibold text-slate-900/90 backdrop-blur-md transition-all group-hover:bg-white/30 group-hover:border-white/55">
                    {card.cta}
                    <span className="text-lg transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </div>

                {/* Bottom sheen line */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
