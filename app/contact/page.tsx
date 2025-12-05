"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setStatus("success");
      form.reset();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err?.message || "Something went wrong.");
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Contact Mike</h1>
        <p className="text-gray-600 mb-6">
          Want to talk about a project, public-sector digital work, or vibes &amp;
          coding? Drop a note below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mike Willey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell me what you&apos;re thinking..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 transition-transform duration-150 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-green-600 text-sm">
            ✅ Message sent! I&apos;ll get back to you soon.
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-red-600 text-sm">
            ⚠️ There was a problem sending your message.{" "}
            {errorMessage && <span>({errorMessage})</span>}
          </p>
        )}
      </section>
    </main>
  );
}