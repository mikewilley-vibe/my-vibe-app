"use client";

import { useState } from "react";

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
    } catch (err) {
      console.error(err);
      setFormState("error");
      setError("Hmm, something went wrong. Please try again in a moment.");
    } finally {
      setFormState((prev) => (prev === "submitting" ? "idle" : prev));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Let&apos;s connect 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Got a project idea, accessibility question, or just want to talk
          vibes, public-sector tech, or finance? Drop a note here and I&apos;ll
          get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mike Willey"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How can I help?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Tell me a little about your project, idea, or question…"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {isSuccess && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              Thanks{name ? `, ${name}` : ""}! Your message was sent.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-semibold px-4 py-2 shadow-sm hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </main>
  );
}