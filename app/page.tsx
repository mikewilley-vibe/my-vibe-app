import VibeCard from "./components/vibecard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold mb-3 text-center">
        Mike&apos;s Vibe Coder HQ 🌐
      </h1>
      <p className="mb-10 text-gray-600 text-center">
        Day 2: Building real components and pages 🚀
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <VibeCard
          title="Today&apos;s Mission"
          emoji="🎯"
          message="Use reusable components, clean layouts, and Tailwind to level up your UI."
        />
        <VibeCard
          title="Your Superpower"
          emoji="⚡"
          message="You can now create pages, components, and navigation just like real frontend devs."
        />
        <VibeCard
          title="What&apos;s Next"
          emoji="🚀"
          message="Keep iterating: add sections, animations, and data as you learn."
        />
        <VibeCard
          title="Vibe Reminder"
          emoji="🧘‍♂️"
          message="Tiny daily moves > giant one-time pushes. You are building skill, not just pages."
        />
      </div>
    </main>
  );
}