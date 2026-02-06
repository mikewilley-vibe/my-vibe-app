import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";
import { projects } from "@/app/data/projects";

type Props = {
  count?: number;
};

export default function FeaturedProjectsSection({ count = 3 }: Props) {
  const featuredProjects = projects.slice(0, count);

  return (
    <FadeIn delay={0.05}>
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="label-xs text-blue-600 uppercase">Highlighted Work</p>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="headline-lg text-slate-900">Featured projects</h2>
            <Link
              href="/projects"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Explore all →
            </Link>
          </div>
          <p className="max-w-3xl text-base text-slate-600 leading-relaxed">
            A selection of recent work spanning web development, accessibility, and product design. Each project represents real problem-solving and meticulous attention to detail.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {featuredProjects.map((p: any) => (
            <Link
              key={p.slug ?? p.title}
              href={`/projects/${p.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-white/95 sheen-on-hover edge-highlight"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {p.emoji ?? "📁"}
                </span>
                <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h3>
              </div>

              <p className="line-clamp-3 text-sm text-slate-600 flex-grow">
                {p.description ?? p.longDescription ?? ""}
              </p>

              <span className="mt-auto text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                View details
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}