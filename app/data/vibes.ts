// app/data/vibes.ts

export type VibePost = {
  id: number;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD (must be zero-padded!)
  emoji: string;
  summary: string;
  message: string;
  tags: string[];
  image?: string;
};

export const vibePosts: VibePost[] = [
      {
    id: 26,
    slug: "day-26-shows-page-real-data-real-filters",
    title: "Day 26 — Shows Page: Real Data, Real Filters",
    date: "2025-12-29",
    emoji: "🎟️",
    summary:
      "Cleaned up the Shows experience: two tabs, real concert-only data, and venue filtering that feels intentional.",
    message:
      "Day 26 was about making the Shows page feel like a feature, not a demo.\n\n" +
      "I tightened the scope: concerts only, predictable tabs, and a local-venues filter that actually helps. I leaned into defensive UI rendering so bad data doesn’t turn into broken cards.\n\n" +
      "The big win was mindset: when results looked wrong, I stopped tweaking the UI and traced the data back through the API. Once the shape was right, the UI snapped into place.\n\n" +
      "This is the kind of work that turns \"cool idea\" into \"I’d actually use this.\"",
    tags: ["day-26", "shows", "ticketmaster", "filters", "debugging", "product-thinking"],
  },
  {
    id: 25,
    slug: "day-25-ticketmaster-shape-truth",
    title: "Day 25 — The Shape of Truth",
    date: "2025-12-28",
    emoji: "🧾",
    summary:
      "Stopped guessing. Logged the raw responses. Fixed the real issue: double-transforming data.",
    message:
      "Day 25 was a classic API lesson: the UI wasn’t the problem — the data shape was.\n\n" +
      "I added focused debug output, inspected the raw Ticketmaster payload, and realized I was transforming events twice. That created empty fields like dateTime/venue/city and the UI fell back to TBD.\n\n" +
      "Fixing the pipeline made everything cleaner: one transform, consistent Concert objects, predictable rendering.\n\n" +
      "This was a confidence-builder: I can reason about systems now, not just components.",
    tags: ["day-25", "api", "ticketmaster", "data-shape", "debugging", "systems"],
  },
  {
    id: 24,
    slug: "day-24-uvafication-results-pages",
    title: "Day 24 — UVA Results Pages That Feel Legit",
    date: "2025-12-27",
    emoji: "🏟️",
    summary:
      "Built real results pages for basketball + football with record summaries, two-column layout, and clean nav.",
    message:
      "Day 24 was about turning sports pages into something that feels finished.\n\n" +
      "I separated upcoming vs results, added record summaries, and got the layout consistent across football and basketball. The two-column split made the pages scanable, and the recap links made it useful.\n\n" +
      "I also cleaned up the navbar dropdown behavior so it closes on route change and outside click — small detail, huge polish.\n\n" +
      "This is the kind of feature that tells someone: this wasn’t copied from a tutorial.",
    tags: ["day-24", "uva", "results", "ui", "navigation", "polish"],
  },
  {
    id: 23,
    slug: "day-23-espn-debugging-wins",
    title: "Day 23 — ESPN Debugging Wins",
    date: "2025-12-26",
    emoji: "🧪",
    summary:
      "Tracked down NaN scores, fixed finals detection, and made the results API reliable.",
    message:
      "Day 23 was pure debugging.\n\n" +
      "ESPN’s data shape wasn’t consistent — sometimes scores were numbers, sometimes nested objects. I stopped assuming and wrote score pickers that could handle the messy reality.\n\n" +
      "Once the parsing was solid, the UI stopped lying. Finals were finals. Scores were real. And the page became trustworthy.\n\n" +
      "A good dev skill isn’t writing code fast — it’s making uncertain inputs predictable.",
    tags: ["day-23", "espn", "api", "debugging", "reliability", "parsing"],
  },
  {
    id: 22,
    slug: "day-22-shipping-and-vercel-muscle",
    title: "Day 22 — Shipping Muscle Memory",
    date: "2025-12-25",
    emoji: "🚢",
    summary:
      "Tightened my ship flow: smaller commits, clearer checkpoints, and smoother deploys.",
    message:
      "Day 22 was about building the habit of shipping.\n\n" +
      "I focused on small, safe changes, committed more frequently, and kept the repo in a state where I could deploy without fear.\n\n" +
      "The big lesson: speed comes from trust — trust in your checkpoints, trust in your rollback path, trust in your process.\n\n" +
      "When shipping gets boring, that’s a sign the system is healthy.",
    tags: ["day-22", "shipping", "git", "vercel", "process", "habits"],
  },
  {
    id: 21,
    slug: "day-21-better-navigation-feels-like-product",
    title: "Day 21 — Navigation That Feels Like a Product",
    date: "2025-12-24",
    emoji: "🧭",
    summary:
      "Improved the UX glue: dropdown behavior, route transitions, and page structure consistency.",
    message:
      "Day 21 was about the glue — the stuff users feel immediately.\n\n" +
      "I improved dropdown behavior, cleaned up routes, and made sure pages share consistent structure. When the nav behaves, the whole site feels more confident.\n\n" +
      "It’s easy to chase flashy features. But navigation and structure are what make everything else feel intentional.\n\n" +
      "This was a \"quiet wow\" day — and those are the ones that level up a project.",
    tags: ["day-21", "navigation", "ux", "consistency", "components"],
  },
  {
    id: 20,
    slug: "day-20-concerts-focus-no-more-jambase",
    title: "Day 20 — Concerts Only, No More JamBase",
    date: "2025-12-23",
    emoji: "🎶",
    summary:
      "Cut the dead weight and refocused the Shows page around one reliable source and a clearer goal.",
    message:
      "Day 20 was a good reminder: not every integration is worth saving.\n\n" +
      "JamBase wasn’t giving me clean, reliable output for what I wanted, so I removed the dependency and pushed the Shows page toward a simpler, more stable plan.\n\n" +
      "The project instantly felt lighter. Fewer moving parts. Fewer weird edge cases. More control.\n\n" +
      "This was a product decision, not a coding decision — and that’s growth.",
    tags: ["day-20", "shows", "scope", "cleanup", "product"],
  },
  {
    id: 19,
    slug: "day-19-concerts-and-location-thinking",
    title: "Day 19 — Location Thinking",
    date: "2025-12-22",
    emoji: "📍",
    summary:
      "Started treating location as a first-class feature: radius, venues, and time windows that make sense.",
    message:
      "Day 19 was about designing the question before coding the answer.\n\n" +
      "Instead of \"show me stuff,\" I framed it as: what’s happening near me, what’s worth seeing, and how can I filter quickly?\n\n" +
      "Radius and time windows became the core model. Once that model is right, every tab and filter becomes a simple expression of it.\n\n" +
      "It’s not just data — it’s a map of my actual life.",
    tags: ["day-19", "concerts", "location", "filters", "modeling"],
  },
  {
    id: 18,
    slug: "day-18-keep-it-working-while-improving",
    title: "Day 18 — Improve Without Breaking",
    date: "2025-12-21",
    emoji: "🧰",
    summary:
      "Kept momentum while protecting stability: change less at once, test more, commit smarter.",
    message:
      "Day 18 was about restraint.\n\n" +
      "I kept improving the site, but I started protecting the parts that already work. Smaller edits, clearer checkpoints, and fewer \"big bang\" refactors.\n\n" +
      "I’m learning that shipping isn’t just finishing — it’s maintaining a baseline of trust while you evolve the system.\n\n" +
      "Momentum feels better when you’re not afraid of your own code.",
    tags: ["day-18", "process", "stability", "git", "momentum"],
  },
  {
    id: 17,
    slug: "day-17-small-polish-big-feel",
    title: "Day 17 — Small Polish, Big Feel",
    date: "2025-12-20",
    emoji: "✨",
    summary:
      "Tightened UI details that make the app feel intentional instead of accidental.",
    message:
      "Day 17 was a reminder that small decisions compound.\n\n" +
      "I tightened spacing, trimmed visual noise, and made components feel like they belong to the same system. Nothing here is a headline feature — but everything adds up to \"this feels good.\"\n\n" +
      "I also paid attention to what I *don’t* want: clutter, inconsistent patterns, and UI that fights the user.\n\n" +
      "These are the days that keep a project from turning into a pile of half-finished ideas. The code got cleaner, and the experience got calmer.\n\n" +
      "Quiet progress is still progress — and it’s the kind that lasts.",
    tags: ["day-17", "polish", "ui", "consistency", "cleanup", "momentum"],
  },
  {
    id: 16,
    slug: "day-16-scores-and-weather-rhythm",
    title: "Day 16 — Scores & Weather Rhythm",
    date: "2025-12-19",
    emoji: "📡",
    summary:
      "Made the dashboard feel alive with refresh cycles, presets, and clickable utility.",
    message:
      "Day 16 was about rhythm — the feeling that the site is current.\n\n" +
      "I tuned the ScoresBanner behavior, made sure the refresh cycle is predictable, and kept the UI thin and readable so it doesn’t overpower the page.\n\n" +
      "I like when features do one job well: show the important info, update reliably, and get out of the way.\n\n" +
      "The Weather + Scores block now feels like a single \"status bar\" for my day, which is exactly what I wanted.\n\n" +
      "This is the kind of feature that turns a site into a habit.",
    tags: ["day-16", "scores", "weather", "api", "refresh", "dashboard"],
  },
  {
    id: 15,
    slug: "day-15-back-to-stable-forward-to-better",
    title: "Day 15 — Back to Stable, Forward to Better",
    date: "2025-12-18",
    emoji: "🧭",
    summary:
      "Got everything working again, then locked in a plan to improve without breaking stuff.",
    message:
      "Day 15 was about stability.\n\n" +
      "After moving fast for a few days, I hit the point where things started to drift — components living in the wrong place, imports getting messy, and changes piling up.\n\n" +
      "I re-centered the project: verify what works, restore what broke, and commit in a way that keeps the repo safe.\n\n" +
      "The biggest win wasn’t code — it was process. More frequent commits, smaller changes, and cleaner checkpoints.\n\n" +
      "Now I can build faster *because* the foundation is stable.",
    tags: ["day-15", "stability", "git", "process", "refactor", "foundation"],
  },
  {
  id: 14,
  slug: "day-14-architecture-cleanup",
  title: "Day 14 — Architecture Cleanup",
  date: "2025-12-17",
  emoji: "🧹",
  summary:
    "Stepped back to clean up structure, components, and file organization.",
  message:
    "Day 14 was less about features and more about *order*.\n\n" +
    "I spent time understanding my folder structure, untangling components, and fixing things that had grown organically as I learned. Some pages weren’t using shared components yet, others had logic living where it didn’t belong.\n\n" +
    "I restored files, compared versions, and made intentional decisions about what should be a reusable component versus what should stay page-specific.\n\n" +
    "This day reminded me that architecture isn’t something you get right on day one — it’s something you earn by building, breaking, and then cleaning up after yourself.\n\n" +
    "It wasn’t flashy, but the codebase feels calmer, clearer, and more maintainable now. That’s a win.",
  tags: [
    "day-14",
    "architecture",
    "refactor",
    "cleanup",
    "components",
    "maintainability",
  ],
},
{
    id: 13,
    slug: "day-13-refactoring-confidence",
    title: "Day 13 — Refactoring with Confidence",
    date: "2025-12-16",
    emoji: "🧱",
    summary:
      "Stopped chasing new features and started shaping what already exists.",
    message:
      "Day 13 felt different — calmer, more confident. Instead of adding new pages or APIs, I focused on refactoring what I’d already built.\n\n" +
      "I broke large sections into reusable components, experimented with layout changes, and made judgment calls about what actually looked and felt right.\n\n" +
      "Some ideas got rolled back. Others stuck. And that was the win.\n\n" +
      "This was the first day I wasn’t just *learning how* to do something — I was deciding *whether* it should exist at all. That shift feels important.",
    tags: [
      "day-13",
      "refactoring",
      "components",
      "confidence",
      "decision-making",
      "vibe-coder",
    ],
  },
  {
    id: 12,
    slug: "day-12-components-clicked",
    title: "Day 12 — Components Clicked",
    date: "2025-12-15",
    emoji: "🧱",
    summary:
      "Focused on components, reuse, and structure — and everything felt easier.",
    message:
      "Day 12 was one of those rare days where things just *worked*.\n\n" +
      "I spent the day refactoring and building reusable components — sections, image layouts, badges, and shared patterns that I can now drop anywhere across the site.\n\n" +
      "Instead of fighting layout or rewriting the same JSX, I was composing pages out of clean, intentional pieces. The code felt calmer. The UI felt more consistent.\n\n" +
      "This was a big mindset shift: I’m no longer building pages — I’m building a system. And that made this one of the most satisfying days so far.",
    tags: ["day-12", "components", "refactor", "momentum", "win"],
  },
  {
    id: 11,
    slug: "day-11-api-wrestling-match",
    title: "Day 11 — Wrestling With APIs",
    date: "2025-12-14",
    emoji: "🥊",
    summary:
      "Fought the data, questioned everything, and learned more than I expected.",
    message:
      "Day 11 felt like a grind. APIs didn’t return what I thought they would, fields were missing, and small changes broke things in ways I didn’t anticipate.\n\n" +
      "I spent a lot of time stepping through responses, logging raw data, and figuring out where my assumptions were wrong. Some moments were frustrating — especially when things *almost* worked.\n\n" +
      "But this was real learning. I stopped expecting APIs to be clean and started treating them as inputs that need to be inspected, validated, and adapted.\n\n" +
      "By the end of the day, the code was better — but more importantly, my mindset was.",
    tags: ["day-11", "api", "debugging", "learning", "resilience"],
  },
  {
    id: 10,
    slug: "day-10-api-reality-check",
    title: "Day 10 — API Reality Check",
    date: "2025-12-13",
    emoji: "🧠",
    summary:
      "APIs stopped being theoretical and started being real. This is where things got messy — and clicked.",
    message:
      "Day 10 was the point where tutorials stopped holding my hand. I worked with JamBase and TheSportsDB APIs, built and refactored Next.js route handlers, and dealt with endpoints that didn’t behave the way I expected.\n\n" +
      "I ran into incomplete data, confusing parameters, environment variables that worked locally but failed on deploy, and APIs that only returned one game when I needed a full schedule.\n\n" +
      "Instead of asking what the right code was, I started inspecting raw responses, logging keys, reshaping data, and adjusting assumptions. This was frustrating — and also the first time I really felt like a developer.\n\n" +
      "I didn’t just use APIs. I learned what they actually are: inconsistent, opinionated, and something you have to adapt to.",
    tags: ["day-10", "api", "debugging", "next.js", "milestone", "real-dev"],
  },
  {
    id: 9,
    slug: "day-9-ux-cleanup-and-clarity",
    title: "Day 9 — UX Cleanup & Clarity",
    date: "2025-12-12",
    emoji: "✨",
    summary:
      "Stopped chasing features and focused on clarity, spacing, and flow.",
    message:
      "Day 9 was about stepping back and cleaning things up. I focused on spacing, typography, navigation, and mobile layouts instead of adding new features.\n\n" +
      "I rewrote copy, removed placeholders, simplified components, and made decisions about what actually mattered on each page.\n\n" +
      "This day reinforced something important: good development isn’t just about writing code — it’s about making thoughtful decisions and knowing when to stop.",
    tags: ["day-9", "ux", "design", "polish"],
  },
  {
    id: 8,
    slug: "day-8-real-content",
    title: "Day 8 — Real Content Over Placeholders",
    date: "2025-12-11",
    emoji: "✍️",
    summary:
      "Turned the site from a demo into something personal and real.",
    message:
      "On Day 8, I replaced placeholder content with real writing and real stories. The Vibe Log became an actual developer journal instead of a list of test entries.\n\n" +
      "Writing real content forced better layout decisions and made the site feel intentional. It stopped being \"practice\" and started feeling like my space.\n\n" +
      "This was also when I realized how closely writing and development are connected — content drives structure, not the other way around.",
    tags: ["day-8", "content", "writing", "ux"],
  },
  {
    id: 7,
    slug: "day-7-shipping-the-homepage",
    title: "Day 7 — Shipping the Homepage",
    date: "2025-12-10",
    emoji: "🚀",
    summary: "Built a homepage that actually tells a story.",
    message:
      "Day 7 was about pulling everything together into a real homepage. I focused on hierarchy, messaging, and flow instead of just linking pages together.\n\n" +
      "This was the first moment the project felt cohesive. The site stopped looking like a collection of experiments and started feeling like a product.\n\n" +
      "Shipping this page gave me momentum and confidence heading into more complex work.",
    tags: ["day-7", "homepage", "shipping", "milestone"],
  },
  {
    id: 6,
    slug: "day-6-framer-motion",
    title: "Day 6 — Motion with Restraint",
    date: "2025-12-09",
    emoji: "🎞️",
    summary: "Learned that good animation is subtle and intentional.",
    message:
      "Day 6 introduced Framer Motion. I added fade-in animations to cards and sections, focusing on smoothness rather than flash.\n\n" +
      "The biggest lesson wasn’t how to animate — it was when not to. Motion should support clarity, not distract from it.\n\n" +
      "This day helped me think more about experience than features.",
    tags: ["day-6", "animation", "framer-motion", "ui"],
  },
  {
    id: 5,
    slug: "day-5-ui-components",
    title: "Day 5 — UI Components & Structure",
    date: "2025-12-08",
    emoji: "🧩",
    summary:
      "Started thinking in reusable components instead of pages.",
    message:
      "On Day 5, I leaned into reusable UI components using Tailwind and shadcn/ui. Cards, badges, and shared layouts replaced one-off styling.\n\n" +
      "This was a shift from building pages to building systems. The codebase became easier to reason about and easier to extend.\n\n" +
      "Once components clicked, everything else moved faster.",
    tags: ["day-5", "components", "ui", "react"],
  },
  {
    id: 4,
    slug: "day-4-dynamic-routing",
    title: "Day 4 — Dynamic Routing Clicked",
    date: "2025-12-07",
    emoji: "🧭",
    summary:
      "Dynamic routes finally made sense — and unlocked everything else.",
    message:
      "Day 4 was all about Next.js routing. I built dynamic routes like `/projects/[slug]` and `/vibes/[slug]` and learned how params and static generation work together.\n\n" +
      "Once this clicked, content stopped being hardcoded and started being data-driven.\n\n" +
      "This was a major unlock that shaped the rest of the project.",
    tags: ["day-4", "routing", "next.js", "milestone"],
  },
  {
    id: 3,
    slug: "day-3-react-basics",
    title: "Day 3 — React Fundamentals",
    date: "2025-12-06",
    emoji: "⚛️",
    summary:
      "Components, props, and state started to feel natural.",
    message:
      "Day 3 focused on React fundamentals. Components, props, and state stopped feeling abstract and started to feel practical.\n\n" +
      "I learned how small pieces combine to create real behavior and how thinking in components simplifies complexity.\n\n" +
      "This day laid the mental groundwork for everything that followed.",
    tags: ["day-3", "react", "fundamentals"],
  },
  {
    id: 2,
    slug: "day-2-tailwind-basics",
    title: "Day 2 — Tailwind Basics",
    date: "2025-12-05",
    emoji: "🎨",
    summary:
      "Utility-first styling started to make sense.",
    message:
      "Day 2 was about learning Tailwind CSS. At first it felt noisy, but once I understood utility-first thinking, styling became faster and more predictable.\n\n" +
      "Instead of fighting CSS, I could focus on layout, spacing, and hierarchy.\n\n" +
      "This day made design feel approachable instead of intimidating.",
    tags: ["day-2", "tailwind", "css"],
  },
  {
    id: 1,
    slug: "day-1-setup",
    title: "Day 1 — Setup & Momentum",
    date: "2025-12-04",
    emoji: "🔧",
    summary:
      "Tools set up. First commit. Momentum started.",
    message:
      "Day 1 was all about setup. Node.js, VS Code, GitHub, Vercel, and a fresh Next.js app.\n\n" +
      "Nothing fancy — but getting everything running and deployed made the project feel real from the start.\n\n" +
      "The most important thing on Day 1 wasn’t code. It was momentum.",
    tags: ["day-1", "setup", "foundation"],
  },
];

// helpers
export function getVibeBySlug(slug: string): VibePost | undefined {
  return vibePosts.find((post) => post.slug === slug);
}

/**
 * Newest first, stable.
 * - Primary sort: date (newest first)
 * - Tiebreaker: id (newest first)
 */
export function getVibesNewestFirst() {
  return [...vibePosts].sort((a, b) => {
    const ad = new Date(a.date + "T12:00:00Z").getTime();
    const bd = new Date(b.date + "T12:00:00Z").getTime();
    if (ad !== bd) return bd - ad;
    return (b.id ?? 0) - (a.id ?? 0);
  });
}