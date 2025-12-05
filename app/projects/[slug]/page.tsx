import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "../../data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// NOTE: params is a Promise in Next 16, so we mark the component async
// and await it before using slug.
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <article className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{project.emoji}</span>
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>

        <p className="text-gray-700 mb-6">{project.longDescription}</p>

        <Link
          href="/projects"
          className="inline-flex items-center text-blue-600 font-semibold hover:underline"
        >
          ← Back to Projects
        </Link>
      </article>
    </main>
  );
}