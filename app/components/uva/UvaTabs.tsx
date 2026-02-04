'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

type TabConfig = {
  label: string;
  href: string;
  id: string;
};

const tabs: TabConfig[] = [
  { label: 'Basketball Schedule', href: '/uva', id: 'schedule' },
  { label: 'Basketball Results', href: '/uva/basketball/results', id: 'basketball-results' },
  { label: 'Football Results', href: '/uva/football/results', id: 'football-results' },
];

function getActiveTabId(pathname: string): string {
  if (pathname === '/uva' || pathname.endsWith('/uva/')) {
    return 'schedule';
  }
  if (pathname.includes('/basketball/results')) {
    return 'basketball-results';
  }
  if (pathname.includes('/football/results')) {
    return 'football-results';
  }
  return 'schedule';
}

export default function UvaTabs() {
  const pathname = usePathname();
  const activeTabId = getActiveTabId(pathname);

  return (
    <div className="mb-6 border-b border-slate-200">
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-1 py-3 text-sm font-semibold border-b-2 transition ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
