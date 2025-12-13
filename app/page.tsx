import Link from "next/link";
import Image from "next/image";
import { projects } from "./data/projects";
import { getVibesNewestFirst } from "./data/vibes";
import FadeIn from "@/components/motion/FadeIn";

const featuredProjects = projects.slice(0, 3);
export default function HomePage() {
  const latestVibes = getVibesNewestFirst().slice(0, 3);
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 pb-16 pt-10">
        <FadeIn>
          <section className="flex flex-col gap-10 md:flex-row md:items-center">
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Mike&apos;s Vibe Coder HQ
              </p>
              <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
                Blending public-sector projects, accessibility, and financial chops ⚖️💻
              </h1>
              <p className="max-w-xl text-base text-slate-600">
                I lead and ship digital projects for governments and agencies —
                from DMV PODS to accessibility programs and payment portals.
                This space is my home base for experiments, projects, and
                tracking the vibe.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/projects"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  View projects
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white"
                >
                  Contact Mike
                </Link>
              </div>

              <p className="text-xs text-slate-500">
                Currently coding in Richmond, VA · Next.js · TypeScript · Drupal · Smartsheet
              </p>
            </div>

            {/* Avatar side */}
            <div className="flex w-full flex-1 justify-center md:justify-end">
              <div className="relative h-40 w-40 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 shadow-lg shadow-blue-500/40">
                {/* If you add a real photo to /public/images/mike-headshot.png,
                  this Image will use it. Otherwise it just shows the gradient. */}
                <Image
                  src="/images/mike-headshot.jpeg"
                  alt="Mike Willey avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        </FadeIn>
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

            <div className="grid gap-4 md:grid-cols-3">
              {featuredProjects.map((p: any) => (
                <Link
                  key={p.slug ?? p.title}
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/70 hover:shadow-md"
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
              {latestVibes.map((v: any, index: number) => (
                <FadeIn key={v.slug ?? v.title} delay={index * 0.06}>
                  <Link href={`/vibes/${v.slug}`} className="group block h-full">
                    <article className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{v.emoji ?? "✨"}</span>
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                          {v.title}
                        </h3>
                      </div>

                      {v.date ? <p className="text-xs text-slate-500">{v.date}</p> : null}

                      <p className="line-clamp-3 text-xs text-slate-600">
                        {v.summary ?? v.message ?? ""}
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
              </div>
    </main>
  );
}