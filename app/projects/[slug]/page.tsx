// app/projects/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to Projects
        </Link>

        {project.image ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={630}
              className="h-56 w-full object-cover md:h-72"
              priority
            />
          </div>
        ) : null}

        <header className="mt-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.emoji ?? "📁"}</span>
            <h1 className="text-3xl font-bold text-slate-900">
              {project.title ?? "Untitled project"}
            </h1>
          </div>

          <p className="mt-3 text-slate-600">{project.message ?? "No summary yet."}</p>
        </header>

        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          <p className="whitespace-pre-line leading-relaxed text-slate-700">
            {project.longDescription ?? "No longDescription provided."}
          </p>

          {project.link ? (
            <p className="mt-2 text-sm">
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {project.link.label}
              </a>
            </p>
          ) : null}
        </section>
      </article>
    </main>
  );
}