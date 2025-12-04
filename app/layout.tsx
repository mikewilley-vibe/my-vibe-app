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
        <nav className="bg-white border-b shadow-sm px-6 py-3 flex gap-6">
          <Link href="/" className="font-semibold hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="font-semibold hover:text-blue-600">
            About
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}