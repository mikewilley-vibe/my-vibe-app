// lib/appConfig.ts
// Feature flags based on deployment domain or environment variable

export type AppMode = 'personal' | 'portfolio';

export function getAppMode(): AppMode {
  // Check environment variable first
  const envMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (envMode === 'personal' || envMode === 'portfolio') {
    return envMode;
  }

  // Fallback to domain-based detection (for production)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'mikewilley.app' || hostname.includes('localhost')) {
      return 'personal';
    }
    if (hostname.includes('portfolio')) {
      return 'portfolio';
    }
  }

  // Default to personal for server-side
  return 'personal';
}

export const appConfig = {
  personal: {
    name: 'Mike\'s Vibe',
    description: 'Personal use - Shows, UVA, Girl Scouts, Orchard House, HIIT, Local Sausage',
    showProjects: false,
    showVibes: false,
    showAbout: false,
    showGallery: false,
    showContact: false,
    hidePortfolioFeatures: true,
    navItems: [
      { label: 'Shows', href: '/shows' },
      { label: 'UVA', href: '/uva' },
      { label: 'Girl Scouts', href: 'https://bea-troop-site.vercel.app/' },
      { label: 'Orchard House', href: 'https://www.orchardhousebasketball.org/' },
      { label: 'HIIT Timer', href: '/workout-timer' },
      { label: 'Local Sausage', href: 'https://local-sausage.vercel.app/' },
    ],
  },
  portfolio: {
    name: 'Mike Willey - Portfolio',
    description: 'Portfolio showcase - Projects, Vibes, Work, and more',
    showProjects: true,
    showVibes: true,
    showAbout: true,
    showGallery: true,
    showContact: true,
    hidePortfolioFeatures: false,
    navItems: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Vibes', href: '/vibes' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};

export function isPersonalMode(): boolean {
  return getAppMode() === 'personal';
}

export function isPortfolioMode(): boolean {
  return getAppMode() === 'portfolio';
}

export function getConfig() {
  const mode = getAppMode();
  return appConfig[mode];
}
