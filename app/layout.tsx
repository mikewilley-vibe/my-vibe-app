/* eslint-disable @next/next/no-html-link-for-pages, @next/next/google-font-display */
import "./globals.css";
import type { Metadata, Viewport } from "next";
import TransitionProvider from "@/app/components/motion/TransitionProvider";
import DynamicBackground from "@/app/components/layout/DynamicBackground";
import { Fraunces, Manrope } from "next/font/google";
import { CommandPalette } from "@/app/components/ui";
import SiteHeader from "@/app/components/nav/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Mike's Vibe HQ",
    template: "%s · Mike's Vibe HQ",
  },
  description:
    "Personal HQ — family, shows, UVA, and the tools that keep the week moving.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3A6361" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${fraunces.variable} ${manrope.variable} font-sans grain-texture`}>
        <DynamicBackground>
          <div className="fixed inset-0 pointer-events-none -z-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--harbor)]/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--signal)]/6 rounded-full blur-3xl" />
          </div>

          <SiteHeader />

          <main className="flex-1 relative z-10">
            <TransitionProvider>{children}</TransitionProvider>
          </main>

          <footer className="relative z-20 border-t border-[var(--fog)] bg-[var(--paper)]/80 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-[var(--ink-muted)]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  © {new Date().getFullYear()} Mike&apos;s Vibe HQ
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <a href="/shows" className="hover:text-[var(--harbor)] transition-colors">
                    Shows
                  </a>
                  <a href="/uva" className="hover:text-[var(--harbor)] transition-colors">
                    UVA
                  </a>
                  <a href="/workout-timer" className="hover:text-[var(--harbor)] transition-colors">
                    Timer
                  </a>
                  <a
                    href="https://github.com/mikewilley-vibe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--harbor)] transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </DynamicBackground>
        <CommandPalette />
      </body>
    </html>
  );
}
