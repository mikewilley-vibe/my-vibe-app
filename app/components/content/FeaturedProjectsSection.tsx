import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { projects } from "@/app/data/projects";

type Props = {
  count?: number;
};

export default function FeaturedProjectsSection({ count = 3 }: Props) {
  const featuredProjects = projects.slice(0, count);

  return (
    <FadeIn delay={0.05}>
      <section>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Highlighted work"
            title="Featured projects"
            description="Recent work spanning web development, accessibility, and product design."
            className="mb-0"
          />
          <Link
            href="/projects"
            className="shrink-0 text-sm font-semibold text-[var(--harbor)] hover:underline"
          >
            Explore all →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredProjects.map((p) => (
            <Link
              key={p.slug ?? p.title}
              href={`/projects/${p.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--fog)] bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--harbor)]/30 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--harbor)] transition-colors line-clamp-2">
                {p.title}
              </h3>

              <p className="line-clamp-3 text-sm text-[var(--ink-muted)] flex-grow">
                {p.message ?? p.longDescription ?? ""}
              </p>

              <span className="mt-auto text-xs font-semibold uppercase tracking-wide text-[var(--harbor)] inline-flex items-center gap-1">
                View details
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
