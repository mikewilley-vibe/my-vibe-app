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
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold">Featured projects 🚀</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            See all projects →
          </Link>
        </div>

        <p className="max-w-2xl text-sm text-slate-600">
          A few highlights from the real work behind the scenes — DMV temp tags,
          VDACS sites, accessibility programs, and more.
        </p>

        {/* Projects grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((p: any) => (
            <Link
              key={p.slug ?? p.title}
              href={`/projects/${p.slug}`}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/70 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{p.emoji ?? "📁"}</span>
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                  {p.title}
                </h3>
              </div>

              <p className="line-clamp-3 text-xs text-slate-600">
                {p.description ?? p.longDescription ?? ""}
              </p>

              <span className="mt-auto text-xs font-medium text-blue-600 group-hover:text-blue-700">
                View details →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}