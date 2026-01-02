import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

type ContactRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

function ContactRow({ label, value }: ContactRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}

export default function ContactCard() {
  return (
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
          <ContactRow
            label="Email"
            value={
              <a
                href="mailto:mikewilley@gmail.com"
                className="font-medium text-blue-600 hover:text-pink-600 transition"
              >
                mikewilley@gmail.com
              </a>
            }
          />

          <ContactRow
            label={
              <span className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </span>
            }
            value={
              <a
                href="https://www.instagram.com/bigwilleystyled/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-pink-600 transition"
              >
                @bigwilleystyled
              </a>
            }
          />

          <ContactRow
            label={
              <span className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </span>
            }
            value={
              <a
                href="https://www.linkedin.com/in/mike-willey-6357536/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-pink-600 transition"
              >
                /in/mikewilley
              </a>
            }
          />

          <ContactRow
            label="Let's talk about:"
            value={
              <p className="text-slate-700">
                Public-sector web projects and anything
                that mixes tech and finance.
              </p>
            }
          />

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
  );
}