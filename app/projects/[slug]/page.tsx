import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/app/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;  // ✅ FIXES THE PROMISE ISSUE

  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <article className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8">
        {project.image && (
  <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100">
    <Image
      src={project.image}
      alt={project.title}
      width={1200}
      height={630}
      className="h-48 w-full object-cover md:h-64"
    />
  </div>
)}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{project.emoji}</span>
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>

        <p className="text-gray-700 mb-6">{project.longDescription}</p>

        <Link href="/projects" className="text-blue-600 font-semibold">
          ← Back to Projects
        </Link>
      </article>
    </main>
  );
}