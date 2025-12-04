import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mike's Vibe App",
  description: "Built by Mike Willey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
          {/* NAVBAR */}
          <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-600">
              Mike&apos;s Vibe Coder HQ
            </Link>

            <div className="flex gap-4 text-sm font-semibold">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
              <Link href="/projects" className="hover:text-blue-600">
                Projects
              </Link>
            </div>
          </nav>

          {/* PAGE CONTENT */}
          <main className="flex-1 flex flex-col">{children}</main>

          {/* FOOTER */}
          <footer className="bg-white border-t text-xs text-gray-500 px-6 py-3 flex justify-between">
            <span>© {new Date().getFullYear()} Mike Willey</span>
            <span>Built with Next.js + vibes ⚡</span>
          </footer>
        </div>
      </body>
    </html>
  );
}