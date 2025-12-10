import Link from "next/link";
import VibeCard from "../components/vibecard";
import { projects } from "../data/projects";

export default async function ProjectsPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <section className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Projects &amp; Experience 🚀</h1>
        <p className="text-gray-600">
          A snapshot of the real work behind Mike&apos;s Vibe Coder HQ – blending
          public-sector digital projects, accessibility, and financial chops.
        </p>
      </section>

      <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="block transform transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg">
            <VibeCard title={p.title} emoji={p.emoji} message={p.message} />
          </Link>
        ))}
      </section>
    </main>
  );
}