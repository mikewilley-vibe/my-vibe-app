import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import { formatDate } from "@/app/lib/date";
import { getVibesNewestFirst } from "@/app/data/vibes";

type Props = {
  count?: number;
};

export default function LatestVibesSection({ count = 3 }: Props) {
  const latestVibes = getVibesNewestFirst().slice(0, count);

  return (
    <FadeIn delay={0.1}>
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="label-xs text-blue-600 uppercase">Ongoing Log</p>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="headline-lg text-slate-900">Latest vibes</h2>
            <Link
              href="/vibes"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Open Log →
            </Link>
          </div>
          <p className="max-w-3xl text-base text-slate-600 leading-relaxed">
            Quick snapshots of work in progress, technical insights, and real-time reflections on building and shipping.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latestVibes.map((v, index) => (
            <FadeIn key={v.slug} delay={index * 0.08}>
              <Link href={`/vibes/${v.slug}`} className="group block h-full">
                <article className="flex h-full flex-col gap-4 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-white/95 sheen-on-hover edge-highlight">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {v.emoji ?? "✨"}
                    </span>
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {v.title}
                    </h3>
                  </div>

                  {v.date && (
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {formatDate(v.date)}
                    </p>
                  )}

                  <p className="line-clamp-3 text-sm text-slate-600 flex-grow">
                    {v.summary}
                  </p>

                  <span className="pt-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                    Read more
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}