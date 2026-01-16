"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPersonalMode } from "@/lib/appConfig";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPersonal, setIsPersonal] = useState<boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Detect mode on mount
  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  // close on route change
  useEffect(() => {
    setOpen(false);
    setOtherOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (otherRef.current && !otherRef.current.contains(e.target as Node)) setOtherOpen(false);
    }
    if (open || otherOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, otherOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 shadow-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 hover:from-blue-600 hover:to-blue-400 transition-all">
          Mike's Vibe HQ
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Portfolio Mode: Full navigation (default while loading) */}
          {isPersonal !== true && (
            <>
              <div className="flex items-center gap-1">
                <NavLink href="/about">About</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/vibes">Vibes</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 ml-2">
                {/* Other Sites Dropdown */}
                <div ref={otherRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setOtherOpen(v => !v)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-blue-900 hover:text-orange-500 hover:bg-gradient-to-br hover:from-slate-400 hover:to-slate-300 transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-orange-200"
                  >
                    Links to Other Sites <span className={`text-xs opacity-70 transition-transform ${otherOpen ? "rotate-180" : ""}`}>▾</span>
                  </button>

                  {otherOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50">
                      <DropdownLink href="/uva">UVA Games</DropdownLink>
                      <DropdownLink href="/uva/basketball/results">UVA Basketball Results</DropdownLink>
                      <DropdownLink href="/uva/football/results">UVA Football Results</DropdownLink>
                      <DropdownLink href="/shows">Local Shows</DropdownLink>
                      <DropdownLink href="https://bea-troop-site.vercel.app/">Girl Scout Troop 21</DropdownLink>
                      <DropdownLink href="/workout-timer">HIIT Timer</DropdownLink>
                      <DropdownLink href="https://www.orchardhousebasketball.org/">OHMS Basketball</DropdownLink>
                      <DropdownLink href="/poster-generator">Poster Maker</DropdownLink>
                      <DropdownLink href="https://local-sausage.vercel.app/">Local Sausage</DropdownLink>
                      <DropdownLink href="https://vandy-dance.vercel.app/">Vandy Dance</DropdownLink>
                      <DropdownLink href="https://vandy-accounting-migration.vercel.app/">Vandy Accounting</DropdownLink>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Personal Mode: Simplified utility navigation */}
          {isPersonal === true && (
            <div className="flex items-center gap-1">
              <NavLink href="/shows">Shows</NavLink>
              <NavLink href="/uva">UVA</NavLink>
              <NavLink href="https://bea-troop-site.vercel.app/">Girl Scouts</NavLink>
              <NavLink href="https://www.orchardhousebasketball.org/">Orchard House</NavLink>
              <NavLink href="/workout-timer" highlight>HIIT Timer</NavLink>
              <NavLink href="https://local-sausage.vercel.app/">Local Sausage</NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-blue-900 hover:bg-blue-50 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm px-4 py-3 space-y-2">
          {/* Portfolio Mode Mobile Menu (default while loading) */}
          {isPersonal !== true && (
            <>
              <MobileNavLink href="/about">About</MobileNavLink>
              <MobileNavLink href="/projects">Projects</MobileNavLink>
              <MobileNavLink href="/vibes">Vibes</MobileNavLink>
              <MobileNavLink href="/contact">Contact</MobileNavLink>
              
              {/* UVA Mobile Dropdown */}
              <div className="border-t border-slate-200 pt-2 mt-2">
                <button
                  onClick={() => setOpen(v => !v)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  UVA <span className={`text-xs opacity-70 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                </button>
                {open && (
                  <div className="pl-2 space-y-1 mt-1">
                    <MobileNavLink href="/uva">Upcoming Games</MobileNavLink>
                    <MobileNavLink href="/uva/basketball/results">Basketball Results</MobileNavLink>
                    <MobileNavLink href="/uva/football/results">Football Results</MobileNavLink>
                  </div>
                )}
              </div>

              {/* Links to Other Sites Mobile Dropdown */}
              <div className="border-t border-slate-200 pt-2 mt-2">
                <button
                  onClick={() => setOtherOpen(v => !v)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  Links to Other Sites <span className={`text-xs opacity-70 transition-transform ${otherOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {otherOpen && (
                  <div className="pl-2 space-y-1 mt-1">
                    {/* UVA Links */}
                    <MobileNavLink href="/uva">UVA Games</MobileNavLink>
                    <MobileNavLink href="/uva/basketball">UVA Basketball Results</MobileNavLink>
                    <MobileNavLink href="/uva/football">UVA Football Results</MobileNavLink>
                    {/* Local/Events */}
                    <MobileNavLink href="/shows">Local Shows</MobileNavLink>
                    <MobileNavLink href="https://bea-troop-site.vercel.app/">Girl Scout Troop 21</MobileNavLink>
                    {/* Apps */}
                    <MobileNavLink href="/workout-timer" highlight>HIIT Timer</MobileNavLink>
                    <MobileNavLink href="https://www.orchardhousebasketball.org/">OHMS Basketball</MobileNavLink>
                    <MobileNavLink href="/poster-generator">Poster Maker</MobileNavLink>
                    {/* Other */}
                    <MobileNavLink href="https://local-sausage.vercel.app/">Local Sausage</MobileNavLink>
                    <MobileNavLink href="https://vandy-dance.vercel.app/">Vandy Dance</MobileNavLink>
                    <MobileNavLink href="https://vandy-accounting-migration.vercel.app/">Vandy Accounting</MobileNavLink>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Personal Mode Mobile Menu */}
          {isPersonal === true && (
            <>
              <MobileNavLink href="/shows">Shows</MobileNavLink>
              <MobileNavLink href="/uva">UVA</MobileNavLink>
              <MobileNavLink href="https://bea-troop-site.vercel.app/">Girl Scouts</MobileNavLink>
              <MobileNavLink href="https://www.orchardhousebasketball.org/">Orchard House</MobileNavLink>
              <MobileNavLink href="/workout-timer" highlight>HIIT Timer</MobileNavLink>
              <MobileNavLink href="https://local-sausage.vercel.app/">Local Sausage</MobileNavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, highlight }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-orange-200 ${
        highlight
          ? "text-blue-900 hover:text-orange-500 hover:bg-gradient-to-br hover:from-slate-400 hover:to-slate-300"
          : "text-blue-900 hover:text-orange-500 hover:bg-gradient-to-br hover:from-slate-400 hover:to-slate-300 hover:shadow-md"
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
      className="block px-3 py-2 rounded-lg text-sm text-blue-900 hover:text-orange-500 hover:bg-gradient-to-br hover:from-slate-400 hover:to-slate-300 transition-all transform hover:scale-105 hover:shadow-md hover:shadow-orange-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, highlight }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        highlight
          ? "text-blue-600 hover:text-orange-500 hover:bg-blue-50"
          : "text-blue-900 hover:text-orange-500 hover:bg-blue-50"
      }`}
    >
      {children}
    </Link>
  );
}