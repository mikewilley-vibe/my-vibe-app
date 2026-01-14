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
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 shadow-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 hover:from-blue-600 hover:to-blue-400 transition-all">
          Mike's Vibe HQ
        </Link>

        <div className="flex items-center gap-1">
          {/* Main navigation links */}
          <div className="hidden sm:flex items-center gap-1">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/vibes">Vibes</NavLink>
            <NavLink href="/shows">Shows</NavLink>
            
            {/* UVA Dropdown */}
            <div ref={ref} className="relative">
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
              >
                UVA <span className={`text-xs opacity-70 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
              </button>

              {open && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50">
                  <DropdownLink href="/uva">Upcoming Games</DropdownLink>
                  <DropdownLink href="/uva/basketball/results">Basketball Results</DropdownLink>
                  <DropdownLink href="/uva/football/results">Football Results</DropdownLink>
                </div>
              )}
            </div>
          </div>

          {/* Right section: External/Special links */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 ml-2">
            <NavLink href="/workout-timer" highlight>HIIT Timer</NavLink>
            <NavLink href="/poster-generator">Poster</NavLink>
            <NavLink href="https://www.orchardhousebasketball.org/">OHMS</NavLink>
            <NavLink href="https://vandy-dance.vercel.app/">Vandy Dance</NavLink>
            <NavLink href="https://bea-troop-site.vercel.app/">GS Troop 21</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children, highlight }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        highlight
          ? "text-sky-600 hover:text-sky-700 hover:bg-sky-50/50"
          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/50"
      }`}
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
    >
      {children}
    </Link>
  );
}