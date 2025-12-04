import VibeCard from "../components/vibecard";

export default function ProjectsPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <section className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Projects 🚀</h1>
        <p className="text-gray-600">
          A growing list of things you&apos;ll build as your vibe coder powers
          level up.
        </p>
      </section>

      <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <VibeCard
          title="My Vibe App"
          emoji="🌐"
          message="Your first Next.js + Tailwind project, deployed on Vercel with GitHub."
        />
        <VibeCard
          title="Coming Soon"
          emoji="🧩"
          message="API routes, forms, and interactive UI components."
        />
        <VibeCard
          title="Stretch Goals"
          emoji="🏗️"
          message="Maybe a dashboard for your real-life projects, or a portfolio site."
        />
        <VibeCard
          title="Wild Ideas"
          emoji="🌀"
          message="Music visualizers, workout trackers, or anything that matches your vibe."
        />
      </section>
    </main>
  );
}