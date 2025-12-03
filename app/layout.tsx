import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "My Vibe App",
  description: "Mike Willey's Day 1 Vibe Coder App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
