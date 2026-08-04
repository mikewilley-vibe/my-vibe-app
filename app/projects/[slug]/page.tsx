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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white px-4 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </Link>
        </nav>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
          {project.image ? (
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-6 sm:px-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  width={1200}
                  height={800}
                  className="mx-auto max-h-[420px] w-auto object-contain"
                  priority
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-8 p-6 sm:p-8">
            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Project
              </p>
              <div className="flex items-start gap-3">
                {project.emoji ? (
                  <span className="text-3xl" aria-hidden="true">
                    {project.emoji}
                  </span>
                ) : null}
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {project.title}
                </h1>
              </div>
              {summary ? (
                <p className="max-w-2xl text-base text-slate-600">{summary}</p>
              ) : null}
            </header>

            {details ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Details</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-700">
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
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
