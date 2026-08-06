"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig, isPersonalMode, type NavItem } from "@/lib/appConfig";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPersonal, setIsPersonal] = useState<boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  useEffect(() => {
    setOpen(false);
    setOtherOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (otherRef.current && !otherRef.current.contains(e.target as Node)) setOtherOpen(false);
    }
    if (open || otherOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, otherOpen]);

  const personalNav = appConfig.personal.navItems;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--paper)]/85 border-b border-[var(--fog)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-[var(--ink)] hover:text-[var(--harbor)] transition-colors"
        >
          Mike&apos;s Vibe HQ
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isPersonal !== true && (
            <>
              <div className="flex items-center gap-1">
                <NavLink href="/about">About</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/vibes">Vibes</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-[var(--fog)] ml-2">
                <div ref={otherRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setOtherOpen((v) => !v)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink)] hover:text-[var(--signal)] hover:bg-white/70 transition-colors"
                  >
                    Links{" "}
                    <span className={`text-xs opacity-70 inline-block transition-transform ${otherOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {otherOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-xl border border-[var(--fog)] bg-white shadow-md p-2 z-50 max-h-[70vh] overflow-y-auto">
                      <DropdownLink href="https://mikewilley.app/">Personal Page</DropdownLink>
                      <DropdownLink href="https://sow-clause-creator.vercel.app/">SOW Generator (Beta)</DropdownLink>
                      <DropdownLink href="https://accessibility-ruby.vercel.app/">Accessibility Audit</DropdownLink>
                      <DropdownLink href="https://st-patricks-wolfhounds.vercel.app/">St. Patrick&apos;s Basketball</DropdownLink>
                      <DropdownLink href="https://howlett-law.vercel.app/">Howlett Law</DropdownLink>
                      <DropdownLink href="https://www.adalemartin.com/">Adale Martin</DropdownLink>
                      <DropdownLink href="https://skoshieshelties.com/">Skoshie Shelties</DropdownLink>
                      <DropdownLink href="https://vandydancecompany.com/">Vandy Dance</DropdownLink>
                      <DropdownLink href="https://vandy-accounting-migration.vercel.app/">Vandy Accounting</DropdownLink>
                      <DropdownLink href="/uva">UVA Games</DropdownLink>
                      <DropdownLink href="/uva/basketball/results">UVA Basketball Results</DropdownLink>
                      <DropdownLink href="/uva/football/results">UVA Football Results</DropdownLink>
                      <DropdownLink href="/shows">Local Shows</DropdownLink>
                      <DropdownLink href="https://bea-troop-site.vercel.app/">Girl Scout Troop 21</DropdownLink>
                      <DropdownLink href="/workout-timer">HIIT Timer</DropdownLink>
                      <DropdownLink href="https://www.orchardhousebasketball.org/">OHMS Basketball</DropdownLink>
                      <DropdownLink href="/poster-generator">Poster Maker</DropdownLink>
                      <DropdownLink href="https://local-sausage.vercel.app/">Seasonal Sous Chef</DropdownLink>
                      <DropdownLink href="https://card-of-first-food.vercel.app/">Card of First Food</DropdownLink>
                      <DropdownLink href="https://explain-it-peach.vercel.app/">Explain It (Beta)</DropdownLink>
                      <DropdownLink href="https://collector-gold.vercel.app/">Collector</DropdownLink>
                      <DropdownLink href="https://prompt-wizard-ebon.vercel.app/">Prompt Wizard</DropdownLink>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {isPersonal === true && (
            <div className="flex items-center gap-1">
              {personalNav.map((item) => (
                <NavLink key={item.href} href={item.href} highlight={item.highlight} pathname={pathname}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1.5">
          {isPersonal === true && (
            <>
              <Link
                href="/shows"
                className={[
                  "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors",
                  pathname === "/shows" || pathname.startsWith("/shows/")
                    ? "bg-white text-[var(--harbor)] ring-1 ring-[var(--fog)]"
                    : "text-[var(--ink)] hover:bg-white/70 hover:text-[var(--harbor)]",
                ].join(" ")}
              >
                Shows
              </Link>
              <Link
                href="/uva"
                className={[
                  "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors",
                  pathname === "/uva" || pathname.startsWith("/uva/")
                    ? "bg-white text-[var(--harbor)] ring-1 ring-[var(--fog)]"
                    : "text-[var(--ink)] hover:bg-white/70 hover:text-[var(--harbor)]",
                ].join(" ")}
              >
                UVA
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-[var(--ink)] hover:bg-white/70 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--fog)] bg-[var(--paper)]/95 backdrop-blur-sm px-4 py-3 space-y-1">
          {isPersonal !== true && (
            <>
              <MobileNavLink href="/about">About</MobileNavLink>
              <MobileNavLink href="/projects">Projects</MobileNavLink>
              <MobileNavLink href="/vibes">Vibes</MobileNavLink>
              <MobileNavLink href="/contact">Contact</MobileNavLink>

              <div className="border-t border-[var(--fog)] pt-2 mt-2">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink)] hover:bg-white/70 transition-colors flex items-center justify-between"
                >
                  UVA{" "}
                  <span className={`text-xs opacity-70 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                </button>
                {open && (
                  <div className="pl-2 space-y-1 mt-1">
                    <MobileNavLink href="/uva">Upcoming Games</MobileNavLink>
                    <MobileNavLink href="/uva/basketball/results">Basketball Results</MobileNavLink>
                    <MobileNavLink href="/uva/football/results">Football Results</MobileNavLink>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--fog)] pt-2 mt-2">
                <button
                  onClick={() => setOtherOpen((v) => !v)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink)] hover:bg-white/70 transition-colors flex items-center justify-between"
                >
                  Links{" "}
                  <span className={`text-xs opacity-70 transition-transform ${otherOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {otherOpen && (
                  <div className="pl-2 space-y-1 mt-1">
                    <MobileNavLink href="https://mikewilley.app/">Personal Page</MobileNavLink>
                    <MobileNavLink href="https://sow-clause-creator.vercel.app/">SOW Generator (Beta)</MobileNavLink>
                    <MobileNavLink href="https://accessibility-ruby.vercel.app/">Accessibility Audit</MobileNavLink>
                    <MobileNavLink href="https://st-patricks-wolfhounds.vercel.app/">St. Patrick&apos;s Basketball</MobileNavLink>
                    <MobileNavLink href="https://howlett-law.vercel.app/">Howlett Law</MobileNavLink>
                    <MobileNavLink href="https://www.adalemartin.com/">Adale Martin</MobileNavLink>
                    <MobileNavLink href="https://skoshieshelties.com/">Skoshie Shelties</MobileNavLink>
                    <MobileNavLink href="https://vandydancecompany.com/">Vandy Dance</MobileNavLink>
                    <MobileNavLink href="https://vandy-accounting-migration.vercel.app/">Vandy Accounting</MobileNavLink>
                    <MobileNavLink href="/uva">UVA Games</MobileNavLink>
                    <MobileNavLink href="/uva/basketball/results">UVA Basketball Results</MobileNavLink>
                    <MobileNavLink href="/uva/football/results">UVA Football Results</MobileNavLink>
                    <MobileNavLink href="/shows">Local Shows</MobileNavLink>
                    <MobileNavLink href="https://bea-troop-site.vercel.app/">Girl Scout Troop 21</MobileNavLink>
                    <MobileNavLink href="/workout-timer" highlight>
                      HIIT Timer
                    </MobileNavLink>
                    <MobileNavLink href="https://www.orchardhousebasketball.org/">OHMS Basketball</MobileNavLink>
                    <MobileNavLink href="/poster-generator">Poster Maker</MobileNavLink>
                    <MobileNavLink href="https://local-sausage.vercel.app/">Seasonal Sous Chef</MobileNavLink>
                    <MobileNavLink href="https://card-of-first-food.vercel.app/">Card of First Food</MobileNavLink>
                    <MobileNavLink href="https://explain-it-peach.vercel.app/">Explain It (Beta)</MobileNavLink>
                    <MobileNavLink href="https://collector-gold.vercel.app/">Collector</MobileNavLink>
                    <MobileNavLink href="https://prompt-wizard-ebon.vercel.app/">Prompt Wizard</MobileNavLink>
                  </div>
                )}
              </div>
            </>
          )}

          {isPersonal === true &&
            personalNav.map((item: NavItem) => (
              <MobileNavLink key={item.href} href={item.href} highlight={item.highlight}>
                {item.label}
              </MobileNavLink>
            ))}
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
  highlight,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
  pathname?: string;
}) {
  const isActive = pathname != null && href.startsWith("/") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "text-[var(--harbor)] bg-white/80 ring-1 ring-[var(--fog)]"
          : highlight
            ? "text-[var(--signal)] hover:bg-white/70"
            : "text-[var(--ink)] hover:text-[var(--harbor)] hover:bg-white/70",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm text-[var(--ink)] hover:text-[var(--harbor)] hover:bg-[var(--paper)] transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        highlight
          ? "text-[var(--signal)] hover:bg-white/70"
          : "text-[var(--ink)] hover:text-[var(--harbor)] hover:bg-white/70",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
