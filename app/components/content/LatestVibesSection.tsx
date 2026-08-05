import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { formatDate } from "@/app/lib/date";
import { getVibesNewestFirst } from "@/app/data/vibes";

type Props = {
  count?: number;
};

export default function LatestVibesSection({ count = 3 }: Props) {
  const latestVibes = getVibesNewestFirst().slice(0, count);

  return (
    <FadeIn delay={0.1}>
      <section>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Ongoing log"
            title="Latest vibes"
            description="Quick snapshots of work in progress and notes from shipping."
            className="mb-0"
          />
          <Link
            href="/vibes"
            className="shrink-0 text-sm font-semibold text-[var(--harbor)] hover:underline"
          >
            Open log →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {latestVibes.map((v, index) => (
            <FadeIn key={v.slug} delay={index * 0.06}>
              <Link href={`/vibes/${v.slug}`} className="group block h-full">
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--fog)] bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--harbor)]/30 hover:shadow-md">
                  {v.date ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
                      {formatDate(v.date)}
                    </p>
                  ) : null}
                  <h3 className="font-display text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--harbor)] transition-colors line-clamp-2">
                    {v.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-[var(--ink-muted)] flex-grow">
                    {v.summary}
                  </p>
                  <span className="mt-auto text-xs font-semibold uppercase tracking-wide text-[var(--harbor)] inline-flex items-center gap-1">
                    Read
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
