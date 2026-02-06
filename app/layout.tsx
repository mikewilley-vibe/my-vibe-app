/* eslint-disable @next/next/no-html-link-for-pages, @next/next/google-font-display */
import "./globals.css";
import type { Metadata, Viewport } from "next";
import TransitionProvider from "@/app/components/motion/TransitionProvider";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/app/components/ui";
import SiteHeader from "@/app/components/nav/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Mike's Vibe Coder HQ",
    template: "%s · Mike's Vibe Coder HQ",
  },
  description:
    "Portfolio + dev journal built with Next.js, TypeScript, and Tailwind.",
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

const inter = Inter({ subsets: ["latin"] });

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
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} grain-texture`}>
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
          {/* Subtle animated background glow */}
          <div className="fixed inset-0 pointer-events-none -z-50">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl" />
          </div>

          {/* NAVBAR */}
<SiteHeader />

          {/* PAGE CONTENT */}
          <main className="flex-1 relative z-10">
  <TransitionProvider>{children}</TransitionProvider>
</main>
          
          {/* FOOTER - Premium styling */}
          <footer className="relative z-20 border-t border-white/20 bg-white/40 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  © {new Date().getFullYear()} Mike's Vibe Coder HQ · Engineered with Next.js
                </div>
                <div className="flex gap-4 text-slate-400">
                  <a href="https://github.com/mikewilley-vibe" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
                    GitHub
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}