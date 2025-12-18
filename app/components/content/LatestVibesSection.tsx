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
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold">Latest vibes 🌀</h2>
          <Link
            href="/vibes"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Open Vibe Log →
          </Link>
        </div>

        <p className="max-w-2xl text-sm text-slate-600">
          Quick snapshots of what I&apos;m shipping, solving, and thinking about.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {latestVibes.map((v, index) => (
            <FadeIn key={v.slug} delay={index * 0.06}>
              <Link href={`/vibes/${v.slug}`} className="group block h-full">
                <article className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{v.emoji ?? "✨"}</span>
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                      {v.title}
                    </h3>
                  </div>

                  {v.date && (
                    <p className="text-xs text-slate-500">
                      {formatDate(v.date)}
                    </p>
                  )}

                  <p className="line-clamp-3 text-xs text-slate-600">
                    {v.summary}
                  </p>

                  <span className="mt-auto pt-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
                    Read vibe →
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