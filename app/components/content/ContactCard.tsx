import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail, Facebook } from "lucide-react";

function ContactLink({
  href,
  icon: Icon,
  label,
  handle,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  handle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl border border-[var(--fog)] bg-white/80 px-4 py-3 transition hover:border-[var(--harbor)]/35 hover:shadow-sm"
    >
      <Icon className="h-5 w-5 text-[var(--harbor)]" />
      <div className="text-left min-w-0">
        <div className="text-xs text-[var(--ink-muted)]">{label}</div>
        <div className="truncate text-sm font-semibold text-[var(--ink)]">{handle}</div>
      </div>
    </a>
  );
}

export default function ContactCard() {
  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-[var(--fog)]">
        <div className="flex items-center gap-4 border-b border-[var(--fog)] bg-[var(--ink)] px-6 py-5">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/20">
            <Image
              src="/images/mike-headshot.jpeg"
              alt="Mike Willey avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">How to reach me</h2>
            <p className="text-sm text-white/70">
              Best ways to get in touch for collabs, questions, or vibes.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-[var(--paper)] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)]">
              <Mail className="h-4 w-4 text-[var(--harbor)]" />
              Email
            </span>
            <a
              href="mailto:mikewilley@gmail.com"
              className="font-semibold text-[var(--harbor)] hover:underline"
            >
              mikewilley@gmail.com
            </a>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--ink)]">Connect</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <ContactLink
                href="https://www.instagram.com/bigwilleystyled/?hl=en"
                icon={Instagram}
                label="Instagram"
                handle="@bigwilleystyled"
              />
              <ContactLink
                href="https://www.linkedin.com/in/mike-willey-6357536/"
                icon={Linkedin}
                label="LinkedIn"
                handle="/in/mikewilley"
              />
              <ContactLink
                href="https://www.facebook.com/profile.php?id=100001234567890"
                icon={Facebook}
                label="Facebook"
                handle="/mikewilley"
              />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--harbor)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Mail className="h-4 w-4" />
                Message
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--fog)] bg-[var(--paper)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--ink)] mb-1">Happy to talk about</p>
            <p className="text-sm text-[var(--ink-muted)]">
              Public-sector web, accessibility, finance tooling, or your next build.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
