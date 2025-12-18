// app/shows/badfish/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

const SHOW = {
  artist: "Badfish: A Tribute to Sublime",
  dateLabel: "Fri • Jan 23, 2026",
  timeLabel: "Doors 7:00 PM • Show 8:00 PM",
  venue: "The NorVa",
  city: "Norfolk",
  state: "VA",
  url: "https://www.jambase.com/show/badfish-a-tribute-to-sublime-the-norva-20260123",
};

export default function BadfishPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Badfish 🎸</h1>

          <Link
            href="/shows"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Shows
          </Link>
        </div>

        <p className="text-slate-600">
          Featured upcoming show (source: JamBase page).
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {SHOW.dateLabel}
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {SHOW.artist}
          </h2>

          <p className="mt-1 text-sm text-slate-600">{SHOW.timeLabel}</p>

          <p className="mt-4 text-sm text-slate-700">
            <span className="font-semibold">{SHOW.venue}</span>
            <span className="text-slate-400"> — </span>
            {SHOW.city}, {SHOW.state}
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href={SHOW.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open on JamBase →
            </a>

            <Link
              href="/shows"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse more shows
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}