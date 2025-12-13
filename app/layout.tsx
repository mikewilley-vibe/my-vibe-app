import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import TransitionProvider from "@/components/motion/TransitionProvider";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Mike’s Vibe Coder HQ",
    template: "%s · Mike’s Vibe Coder HQ",
  },
  description:
    "Portfolio + dev journal built with Next.js, TypeScript, and Tailwind.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-slate-50">
          {/* NAVBAR */}
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold text-slate-900">
                Mike’s Vibe Coder HQ
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
  <Link href="/about" className="text-slate-700 hover:text-blue-700">
    About
  </Link>
  <Link href="/projects" className="text-slate-700 hover:text-blue-700">
    Projects
  </Link>
  <Link href="/vibes" className="text-slate-700 hover:text-blue-700">
    Vibes
  </Link>
  <Link href="/shows" className="text-slate-700 hover:text-blue-700">
    Shows
  </Link>
  <Link href="/uva" className="text-slate-700 hover:text-blue-700">
    UVA
  </Link>
  <Link href="/contact" className="text-slate-700 hover:text-blue-700">
    Contact
  </Link>
</div>
            </nav>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1">
  <TransitionProvider>{children}</TransitionProvider>
</main>

          {/* FOOTER */}
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500">
              © {new Date().getFullYear()} Mike’s Vibe Coder HQ
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}