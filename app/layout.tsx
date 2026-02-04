import "./globals.css";
import type { Metadata } from "next";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
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
              © {new Date().getFullYear()} Mike's Vibe Coder HQ
            </div>
          </footer>
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}