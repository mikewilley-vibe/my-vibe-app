import "./globals.css";
import type { Metadata } from "next";
import TransitionProvider from "@/app/components/motion/TransitionProvider";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/app/components/ui";
import SiteHeader from "@/app/components/nav/SiteHeader";

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
<SiteHeader />

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
        <CommandPalette />
      </body>
    </html>
  );
}