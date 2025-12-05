import VibeCard from "./components/vibecard";

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export default async function Home() {
  const res = await fetch(`${baseUrl}/api/vibe`, { cache: "no-store" });
  const vibe: { message: string; mood: string; date: string } = await res.json();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* HERO SECTION */}
      <section className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Mike&apos;s Vibe Coder HQ 🌐
        </h1>

        {/* Vibe of the Day */}
        <p className="text-sm text-gray-500 mb-2">
          Vibe of the Day:{" "}
          <span className="font-semibold text-gray-800">{vibe.message}</span>
        </p>

        <p className="text-gray-600 mb-6">
          Day 3: You&apos;re now using real data, API routes, and full-stack
          muscle. This is no longer a toy project.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/projects"
            className="inline-flex justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            View Projects 🚀
          </a>
          <a
            href="/about"
            className="inline-flex justify-center px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
          >
            Learn About Mike
          </a>
        </div>
      </section>

      {/* CARD GRID */}
      <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <VibeCard
          title="Today's Mission"
          emoji="🎯"
          message="Use reusable components, clean layouts, and API routes to level up your UI."
        />
        <VibeCard
          title="Your Superpower"
          emoji="⚡"
          message="You can now create pages, components, navigation, and APIs like a real frontend dev."
        />
        <VibeCard
          title="What&apos;s Next"
          emoji="🚀"
          message="More data, more pages, and maybe some forms or a small dashboard."
        />
        <VibeCard
          title="Vibe Reminder"
          emoji="🧘‍♂️"
          message="Tiny daily moves > huge one-time pushes. You’re building skill, not just pages."
        />
      </section>
    </main>
  );
}