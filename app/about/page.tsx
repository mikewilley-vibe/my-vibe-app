import Link from "next/link";
import Image from "next/image";
import FamilySection from "../components/content/FamilySection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            About Mike
          </h1>

          <p className="text-lg text-slate-700">
            I&apos;m Mike Willey, a project manager, accountant who loves
            building public-sector digital projects that actually ship. During
            the day I&apos;m blending websites, payments, accessibility, and
            budgets. At night I&apos;m learning to code and building my own
            tools.
          </p>

          <p className="text-slate-700">
            This little HQ is where I&apos;m documenting the journey from
            &quot;power user&quot; to developer — one vibe at a time.
          </p>

          {/* Skills / focus area chips */}
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Project Management
            </span>
            <span className="rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Public-Sector Digital
            </span>
            <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Accessibility
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Finance &amp; Analytics
            </span>
          </div>
        </section>

<FamilySection />

        {/* Contact card */}
        <section>
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5">
            <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src="/images/mike-headshot.jpeg"
                  alt="Mike Willey avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  How to reach me
                </h2>
                <p className="text-xs text-slate-500">
                  Best ways to get in touch for collabs, questions, or vibes.
                </p>
              </div>
            </div>

            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Email</span>
                <a
                  href="mailto:mikewilley@gmail.com"
                  className="text-right font-medium text-blue-600 hover:text-blue-700"
                >
                  mikewilley@gmail.com
                </a>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/mike-willey-6357536/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-right font-medium text-blue-600 hover:text-blue-700"
                >
                  /in/mikewilley
                </a>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Best for</span>
                <p className="text-right text-slate-700">
                  Public-sector web projects, payments, accessibility, and
                  anything that mixes tech + finance.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Go to contact form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}