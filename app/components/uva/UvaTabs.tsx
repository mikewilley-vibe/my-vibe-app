"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UVA_BLUE, UVA_ORANGE } from "./uvaTheme";

type TabConfig = {
  label: string;
  shortLabel: string;
  href: string;
  id: string;
};

const tabs: TabConfig[] = [
  { label: "Schedule", shortLabel: "Schedule", href: "/uva", id: "schedule" },
  {
    label: "Basketball Results",
    shortLabel: "BB Results",
    href: "/uva/basketball/results",
    id: "basketball-results",
  },
  {
    label: "Football Results",
    shortLabel: "FB Results",
    href: "/uva/football/results",
    id: "football-results",
  },
];

function getActiveTabId(pathname: string): string {
  if (pathname === "/uva" || pathname.endsWith("/uva/")) return "schedule";
  if (pathname.includes("/basketball/results")) return "basketball-results";
  if (pathname.includes("/football/results")) return "football-results";
  return "schedule";
}

export default function UvaTabs() {
  const pathname = usePathname();
  const activeTabId = getActiveTabId(pathname);

  return (
    <div className="mb-8 overflow-x-auto border-b" style={{ borderColor: `${UVA_BLUE}22` }}>
      <div className="flex min-w-max gap-5 sm:gap-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative px-0.5 py-3 text-sm font-semibold transition-colors"
              style={{ color: isActive ? UVA_BLUE : "#5c6672" }}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-opacity"
                style={{
                  backgroundColor: UVA_ORANGE,
                  opacity: isActive ? 1 : 0,
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
