// app/shows/page.tsx
import Link from "next/link";

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Shows
        </h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Shows I&apos;m going to
          </p>

          <div className="mt-3">
            <Link
              href="/shows/badfish"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Badfish (Norfolk — Jan 23) →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
