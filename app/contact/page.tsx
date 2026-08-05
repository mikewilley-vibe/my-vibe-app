"use client";

import { useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");

  const isSubmitting = formState === "submitting";
  const isSuccess = formState === "success";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields before sending.");
      return;
    }

    try {
      setFormState("submitting");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setFormState("success");
      setMessage("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setFormState("error");
      setError("Hmm, something went wrong. Please try again in a moment.");
    } finally {
      setFormState((prev) => (prev === "submitting" ? "idle" : prev));
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <section className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <FadeIn>
          <div className="mb-10 space-y-3">
            <p className="label-xs">Contact</p>
            <h1 className="headline-lg">Let&apos;s connect</h1>
            <div className="accent-rule" />
            <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-lg">
              Got a project idea, accessibility question, or just want to talk public-sector tech
              or finance? Drop a note and I&apos;ll get back to you.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 rounded-2xl shadow-sm border border-[var(--fog)] p-6 sm:p-8 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--fog)] bg-white px-4 py-3 text-sm transition placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--harbor)]/35 focus:border-[var(--harbor)]"
                  placeholder="Mike Willey"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-xl border border-[var(--fog)] bg-white px-4 py-3 text-sm transition placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--harbor)]/35 focus:border-[var(--harbor)]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                How can I help?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-[var(--fog)] bg-white px-4 py-3 text-sm transition placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--harbor)]/35 focus:border-[var(--harbor)] resize-none"
                placeholder="Tell me a little about your project, idea, or question…"
              />
            </div>

            {error && (
              <div className="flex gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thanks{name ? `, ${name}` : ""}! Your message was sent.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--harbor)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-center text-sm text-[var(--ink-muted)] mt-8">
            I typically respond within 24 hours
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
