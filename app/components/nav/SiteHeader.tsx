"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">
          Mike’s Vibe Coder HQ
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/about" className="text-slate-700 hover:text-blue-700">About</Link>
          <Link href="/projects" className="text-slate-700 hover:text-blue-700">Projects</Link>
          <Link href="/vibes" className="text-slate-700 hover:text-blue-700">Vibes</Link>
          <Link href="/shows" className="text-slate-700 hover:text-blue-700">Shows</Link>

          {/* ✅ UVA dropdown */}
          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            >
              UVA <span className={`text-xs opacity-70 transition ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
              <div className="absolute left-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-50">
                <Link
                  href="/uva"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Upcoming Games
                </Link>
                <Link
                  href="/uva/basketball/results"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Basketball Results
                </Link>
                <Link
                  href="/uva/football/results"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Football Results
                </Link>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-slate-700 hover:text-blue-700">Contact</Link>
        </div>
      </nav>
    </header>
  );
}