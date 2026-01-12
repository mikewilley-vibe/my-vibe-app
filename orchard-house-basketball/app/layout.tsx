import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orchard House Gryphons Basketball",
  description:
    "Orchard House Middle School Girls Basketball — roster, schedule, stats, and game locations.",

  openGraph: {
    title: "Orchard House Gryphons Basketball",
    description:
      "Roster, schedule, stats, and game locations for Orchard House Middle School Girls Basketball.",
    url: "https://orchardhousebasketball.org",
    siteName: "Orchard House Gryphons",
    images: [
      {
        url: "/images/gryphons.png",
        width: 1200,
        height: 630,
        alt: "Orchard House Gryphons Logo",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Orchard House Gryphons Basketball",
    description:
      "Girls Basketball • Orchard House Middle School • Richmond, VA",
    images: ["/images/gryphons.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}