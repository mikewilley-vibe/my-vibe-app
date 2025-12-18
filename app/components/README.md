# Components (rules of the road)

## Primitives (building blocks)
Use these anywhere. No data-fetching. No business logic.

- Section
- Subsection
- HeroImage
- ImageGrid
- BrandBadgeLink

## Feature components (page sections)
These assemble primitives + data for one purpose. Minimal styling changes.

- LatestVibesSection
- FeaturedProjectsSection
- UvaNextGames (or UvaNextGamesSection, if you wrap it)

## Page components
Live under /app routes. Mostly composition.

- app/page.tsx (Home)
- app/vibes/page.tsx
- app/projects/page.tsx
- app/uva/page.tsx