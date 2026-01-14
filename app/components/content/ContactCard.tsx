import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail, Facebook } from "lucide-react";

type ContactRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

function ContactRow({ label, value }: ContactRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-slate-50 transition-colors">
      <span className="text-slate-600 font-medium">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}

function ContactLink({ href, icon: Icon, label, handle }: { href: string; icon: any; label: string; handle: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-md"
    >
      <Icon className="h-5 w-5 text-blue-600" />
      <div className="text-left">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-semibold text-slate-900">{handle}</div>
      </div>
    </a>
  );
}

export default function ContactCard() {
  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-white to-blue-50/30 shadow-lg ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-5">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white shadow-lg">
            <Image
              src="/images/mike-headshot.jpeg"
              alt="Mike Willey avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              How to reach me
            </h2>
            <p className="text-sm text-blue-100">
              Best ways to get in touch for collabs, questions, or vibes.
            </p>
          </div>
        </div>

        {/* Contact Options */}
        <div className="p-6 space-y-4">
          {/* Email */}
          <ContactRow
            label={
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Email
              </span>
            }
            value={
              <a
                href="mailto:mikewilley@gmail.com"
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                mikewilley@gmail.com
              </a>
            }
          />

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-4">Connect with me</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                <span>Message</span>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-4 border-t border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">Let's talk about:</p>
            <p className="text-slate-600 italic">
              The future of vibe coding, dev tools, or your next big idea.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}