import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/app/components/motion/FadeIn";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { projects } from "@/app/data/projects";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Work"
          title="Projects & experience"
          description="A snapshot of real client work, tools, and experiments behind Mike's Vibe HQ."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p, index) => (
            <FadeIn key={p.slug} delay={Math.min(index * 0.04, 0.28)}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--fog)] bg-white/90 transition hover:-translate-y-0.5 hover:border-[var(--harbor)]/30 hover:shadow-md"
              >
                {p.image ? (
                  <div className="relative h-40 bg-[var(--paper)]">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 to-transparent" />
                  </div>
                ) : (
                  <div className="h-2 bg-[var(--harbor)]/20" />
                )}

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--harbor)] transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)] line-clamp-3">
                    {p.message}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
                    View project
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
