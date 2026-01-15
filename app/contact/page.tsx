"use client";

import { useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

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

    // basic client-side validation
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <section className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <FadeIn>
          <div className="mb-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
                Let&apos;s connect
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-lg">
              Got a project idea, accessibility question, or just want to talk vibes, public-sector tech, or finance? Drop a note and I&apos;ll get back to you.
            </p>
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 sm:p-10 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white group-hover:border-slate-300"
                  placeholder="Mike Willey"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white group-hover:border-slate-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                How can I help?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white group-hover:border-slate-300 resize-none"
                placeholder="Tell me a little about your project, idea, or question…"
              />
            </div>

            {error && (
              <div className="flex items-gap-2 gap-3 text-sm text-red-700 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200 rounded-xl px-4 py-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-3 text-sm text-green-700 bg-gradient-to-r from-green-50 to-green-50/50 border border-green-200 rounded-xl px-4 py-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thanks{name ? `, ${name}` : ""}! Your message was sent.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 active:translate-y-0"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </FadeIn>

        {/* Footer note */}
        <FadeIn delay={0.2}>
          <p className="text-center text-sm text-slate-500 mt-8">
            I typically respond within 24 hours
          </p>
        </FadeIn>
      </section>
    </main>
  );
}