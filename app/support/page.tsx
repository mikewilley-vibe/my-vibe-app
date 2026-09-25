import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support for the My Vibe app by Michael Willey. What the app does, how to reach mikewilley@gmail.com, and answers to common questions.",
};

const faqs = [
  {
    question: "Do I need an account?",
    answer:
      "No. My Vibe does not sign you in. Plans you save stay on the phone you used, and they are not synced to an account.",
  },
  {
    question: "How do I add a plan to my calendar?",
    answer:
      "Open a plan and tap Add to Calendar. Allow calendar access when your phone asks, then pick a calendar. If the family Google calendar is already on your phone, My Vibe offers that one first. The event is written to the calendar you pick. You can change calendar access later in the system Settings app.",
  },
  {
    question: "How do I delete a saved plan?",
    answer:
      "Open the plan and tap Remove from My Vibe. That deletes the copy stored in the app. An event already on your calendar stays there until you delete it in the Calendar app. Deleting My Vibe removes the plans stored on that device. There is no online account to close.",
  },
  {
    question: "What if shows or the UVA schedule will not load?",
    answer:
      "Those lists need an internet connection. Concerts come from ShowSignal, and UVA football and men’s basketball come from public schedules on mikewilley.app. Try again in a moment. If a tab keeps failing, email mikewilley@gmail.com and say which tab you were on.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen pb-16">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <FadeIn>
          <header className="mb-10 space-y-3">
            <p className="label-xs">My Vibe</p>
            <h1 className="headline-lg">Support</h1>
            <div className="accent-rule" />
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-2xl">
              My Vibe is a mobile app by Michael Willey. It keeps a family Google
              calendar in view, lets you save plans on your phone and add the ones you
              choose to a calendar, and lists upcoming concerts around Hampton Roads,
              Richmond, and Washington, DC, plus UVA football and men&apos;s basketball.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.08}>
          <section className="mb-8 rounded-2xl border border-[var(--fog)] bg-white/90 p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Contact
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
              Email Michael Willey and include the phone you are using and what you
              expected to happen.
            </p>
            <p className="mt-4">
              <a
                href="mailto:mikewilley@gmail.com"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--harbor)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                mikewilley@gmail.com
              </a>
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.12}>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Common questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <section
                  key={faq.question}
                  className="rounded-2xl border border-[var(--fog)] bg-white/90 px-6 py-5 shadow-sm"
                >
                  <h3 className="font-semibold text-[var(--ink)]">{faq.question}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
                    {faq.answer}
                  </p>
                </section>
              ))}
            </div>
            <p className="pt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
              How the app handles information is described in the{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[var(--harbor)] underline decoration-[var(--harbor)]/30 underline-offset-2 hover:decoration-[var(--harbor)]"
              >
                privacy policy
              </Link>
              .
            </p>
          </section>
        </FadeIn>
      </article>
    </div>
  );
}
