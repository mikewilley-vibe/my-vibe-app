// app/data/vibes.ts

export type VibePost = {
  id: number;
  slug: string;
  title: string;
  date: string;
  emoji: string;
  summary: string;
  message: string;
  tags: string[];
  image?: string;
};
export const vibePosts: VibePost[] = [
  {
    id: 1,
    slug: "shipping-mikes-vibe-coder-hq",
    title: "Shipping Mike's Vibe Coder HQ",
    date: "2025-12-05",
    emoji: "🚀",
    summary:
      "Got the homepage, projects, and about page all wired up. Feeling like an actual dev.",
    message:
      "Got the homepage, projects, and about page all wired up. Feeling like an actual dev. This was the first time I really saw everything connected end-to-end.\n\nSeeing it in the browser made all the little pieces from the tutorials finally click together.",
    tags: ["shipping", "milestone", "next.js"],
    image: "/vibes/IMG_5360.jpeg",
  },
  {
    id: 2,
    slug: "slug-pages-finally-working",
    title: "Slug pages finally working",
    date: "2025-12-06",
    emoji: "🧩",
    summary:
      "Dynamic /projects/[slug] and /vibes/[slug] routes are live. Routing brain unlocked.",
    message:
      "Dynamic /projects/[slug] and /vibes/[slug] routes are live now. Routing brain officially unlocked.\n\nI finally understand that the folder name [slug] plus page.tsx is what makes the URL work.",
    tags: ["routing", "learning", "next.js"],
  },
  {
    id: 3,
    slug: "day-3-contact-form-upgrades",
    title: "Day 3 contact form upgrades",
    date: "2025-12-07",
    emoji: "📫",
    summary:
      "Polished the contact page and cleaned up the API so Vercel would stop yelling.",
    message:
      "Polished the contact page and cleaned up the API so Vercel would stop yelling at me.\n\nI simplified the contact route handler, removed unused code, and made the error state feel a lot nicer.",
    tags: ["api", "contact form", "bugfix"],
  },
  {
    id: 4,
    slug: "day-4-tag-system-and-ui-polish",
    title: "Tag System & UI Polish",
    date: "2025-12-09",
    emoji: "🏷️",
    summary:
      "Added tags to Vibe Log posts and built a sleek filter bar to sort vibes by category.",
    message:
      "Today I took a big visual and functional step forward — I added tags to all my Vibe Log posts and built a live tag filter bar. This was my first real use of `useState`, `useMemo`, and a proper client component in the app.\n\n" +
      "It feels like the log transformed from a simple list into an actual developer journal. The UI looks cleaner, the tags help define themes in my progress, and the filter bar makes it feel like a real product.\n\n" +
      "Coolest moment: watching the list instantly filter itself when clicking tags. It made the whole system feel alive.\n\n" +
      "I'm starting to see why people love React — small pieces of state can create surprisingly powerful behavior.",
    tags: ["ui", "react", "learning", "tags", "milestone"],
  },
  {
    id: 5,
    slug: "day-5-dynamic-routing-breakthrough",
    title: "Dynamic Routing Breakthrough",
    date: "2025-12-10",
    emoji: "🧭",
    summary:
      "Fully solved the dynamic route issues after a few Next.js curveballs. Slugs now work flawlessly.",
    message:
      "Today was a real developer moment — I finally mastered dynamic routing in Next.js. I debugged the params issue, fixed the folder structure, updated the imports, and understood why the `[slug]` pages weren't rendering.\n\n" +
      "It turns out dynamic routes require really clean paths, correct file structure, and in Next.js 13+, proper handling of async params. Once I got that, everything clicked. The Vibe Log posts now open perfectly from the list.\n\n" +
      "This was the first day where I really felt like I wasn’t just copying code — I was reading errors, understanding their meaning, and solving them like an actual dev.\n\n" +
      "This breakthrough makes me excited about what I can build next.",
    tags: ["routing", "bugfix", "next.js", "learning", "win"],
  },
  {
  id: 6, 
  slug: "day-6-framer-motion-win",
  title: "Framer Motion Win",
  date: "2025-12-11",
  emoji: "✨",
  summary: "Cards now animate in cleanly.",
  message: "...",
  tags: ["animation", "framer-motion", "win"],
},
];  
export function getVibeBySlug(slug: string): VibePost | undefined {
  return vibePosts.find((post) => post.slug === slug);
}

export function getVibesNewestFirst(): VibePost[] {
  return [...vibePosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}