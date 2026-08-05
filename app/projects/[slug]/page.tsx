import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects, getProjectBySlug } from "@/app/data/projects";

type Params = { slug: string };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const summary = project.message?.trim();
  const details = project.longDescription?.trim();

  return (
    <div className="min-h-screen pb-16 px-4 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-muted)] transition hover:text-[var(--harbor)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </Link>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-[var(--fog)] bg-white/90 shadow-sm">
          {project.image ? (
            <div className="border-b border-[var(--fog)] bg-[var(--paper)] px-4 py-6 sm:px-8">
              <div className="relative mx-auto aspect-[16/10] max-h-[420px] overflow-hidden rounded-xl ring-1 ring-[var(--fog)] bg-white">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-contain p-3"
                  priority
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-8 p-6 sm:p-8">
            <header className="space-y-3">
              <p className="label-xs">Project</p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
                {project.title}
              </h1>
              <div className="accent-rule" />
              {summary ? (
                <p className="max-w-2xl text-base text-[var(--ink-muted)] leading-relaxed">
                  {summary}
                </p>
              ) : null}
            </header>

            {details ? (
              <section className="space-y-3">
                <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Details</h2>
                <p className="whitespace-pre-line leading-relaxed text-[var(--ink-muted)]">
                  {details}
                </p>
              </section>
            ) : null}

            {project.link ? (
              <div>
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--harbor)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  {project.link.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
