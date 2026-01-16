# Dual Deployment Setup

This repo is configured to deploy to two different domains with different feature sets:

## Deployment Domains

### 1. Personal Use - `mikewilley.app`
- Shows, UVA, Girl Scouts, Orchard House, HIIT Workout, Local Sausage
- Clean, minimal interface for daily use
- Set `NEXT_PUBLIC_APP_MODE=personal`

### 2. Portfolio Showcase - `mikewilley-portfolio.vercel.app`
- Full portfolio with Projects, Vibes, About, Contact, Gallery
- Showcase all your work and accomplishments
- Set `NEXT_PUBLIC_APP_MODE=portfolio`

## How It Works

The app uses environment variables to determine which features to show:
- All code lives in one repository
- Both deployments pull from the same `main` branch
- Each deployment has its own environment variable configuration
- Features are controlled via `lib/appConfig.ts`

## Deployment Instructions

### Personal App (mikewilley.app)
1. Deploy to Vercel with domain `mikewilley.app`
2. Set environment variable: `NEXT_PUBLIC_APP_MODE=personal`
3. This will only show utility pages: Shows, UVA, Girl Scouts, etc.

### Portfolio App (mikewilley-portfolio.vercel.app)
1. Deploy to Vercel with domain `mikewilley-portfolio.vercel.app`
2. Set environment variable: `NEXT_PUBLIC_APP_MODE=portfolio`
3. This will show full portfolio with Projects, Vibes, About, Contact

## Updating Both Sites

Just make changes in the `main` branch:
- Update to `/shows` page? Both sites update.
- Add a new project? Only shows on portfolio (controlled by config).
- Add a new vibe? Only shows on portfolio (controlled by config).

Both deployments automatically pull changes from `main`.

## Feature Toggle Reference

| Feature | Personal | Portfolio |
|---------|----------|-----------|
| Shows | ✅ | ✅ |
| UVA | ✅ | ✅ |
| Girl Scouts | ✅ | ✅ |
| Orchard House | ✅ | ✅ |
| HIIT Timer | ✅ | ✅ |
| Local Sausage | ✅ | ✅ |
| Projects | ❌ | ✅ |
| Vibes | ❌ | ✅ |
| About | ❌ | ✅ |
| Gallery | ❌ | ✅ |
| Contact | ❌ | ✅ |

## Using the Config in Components

```tsx
import { isPersonalMode, isPortfolioMode, getConfig } from '@/lib/appConfig';

export default function MyComponent() {
  if (isPersonalMode()) {
    return <div>Personal Mode</div>;
  }
  
  if (isPortfolioMode()) {
    return <div>Portfolio Mode</div>;
  }
}
```
