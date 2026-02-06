export type Project = {
  slug: string;
  title: string;
  emoji: string;
  message: string;
  longDescription: string;
  image?: string;
  video?: string;
  link?: {
    href: string;
    label: string;
  };
};

export const projects: Project[] = [
  // ...existing code...
    // ...existing code...
    {
      slug: "card-of-first-food",
      title: "First Food",
      emoji: "🍱",
      message: "A playful card generator for your first memorable food experience.",
      longDescription: "First Food lets you create and share a digital card commemorating your first memorable food or meal. Add a photo, description, and a fun story, then generate a shareable card to celebrate your culinary beginnings!",
      link: {
        href: "https://first-food.vercel.app/",
        label: "First Food",
      },
    },
    {
      slug: "sow-generator",
      title: "SOW Generator (Beta)",
      emoji: "📋",
      message:
        "Create professional Statements of Work in minutes.",
      longDescription:
        "A tool that streamlines the process of creating professional Statements of Work (SOWs) for projects. Fill in project details, scope, timeline, and deliverables, then generate a polished, ready-to-share document. Perfect for freelancers and agencies looking to save time on proposals.",
      link: {
        href: "https://sow-clause-creator.vercel.app/",
        label: "SOW Generator (Beta)",
      },
    },
  {
    slug: "accessibility-audit",
    title: "Accessibility Audit Tool",
    emoji: "♿",
    message:
      "Comprehensive web accessibility auditing and reporting.",
    longDescription:
      "An accessibility audit tool that analyzes websites for WCAG 2.1 compliance. Checks color contrast, keyboard navigation, ARIA labels, screen reader compatibility, and generates detailed reports with actionable recommendations for improvement.",
    link: {
      href: "https://accessibility-ruby.vercel.app/",
      label: "Accessibility Audit",
    },
  },
  {
    slug: "st-patricks-basketball",
    title: "St. Patrick's Wolfhounds Basketball",
    emoji: "🐺",
    message:
      "Built a team website for a Richmond youth basketball program.",
    longDescription:
      "Created a comprehensive team hub for St. Patrick's Wolfhounds basketball program. The site provides schedules, rosters, game updates, and team information to keep players, families, and fans connected throughout the season.",
    link: {
      href: "https://st-patricks-wolfhounds.vercel.app/",
      label: "St. Patrick's Wolfhounds",
    },
  },
  {
    slug: "howlett-law",
    title: "Howlett Law Firm Website",
    emoji: "⚖️",
    message:
      "Modern website for a professional law practice.",
    longDescription:
      "Designed and developed a professional website for Howlett Law. The site showcases their legal services, attorney profiles, practice areas, and provides an easy way for potential clients to get in touch and learn about their expertise.",
    link: {
      href: "https://howlett-law.vercel.app/",
      label: "Howlett Law",
    },
  },
   {
    slug: "local-sausage",
    title: "Seasonal Sous Chef",
    emoji: "🍽️",
    message:
      "Find seasonal produce and create recipes with what's fresh locally.",
    longDescription:
      "A project to discover what's in season locally, find fresh produce from farmers markets and local vendors, and get recipe ideas based on what's available. Browse by season, see what makes local farming special, find new recipes, and explore your next culinary adventure with seasonal ingredients.",
    link: {
      href: "https://local-sausage.vercel.app/",
      label: "Seasonal Sous Chef",
    },
  },
  {
    slug: "orchard-house-basketball",
    title: "Orchard House Middle School Basketball",
    emoji: "🏀",
    message:
      "Built a team hub to keep the squad organized and connected.",
    longDescription:
      "Coaching my daughter's middle school basketball team, I realized there was no centralized place for schedules, game locations, jersey assignments, or team updates. So I built one. It's become the go-to resource for families to stay in sync on practices, games, and everything in between.",
    image: "/images/gryphons.png",
    link: {
      href: "https://orchardhousebasketball.org",
      label: "Orchard House Hoops",
  },
   },
  {
    slug: "beas-girl-scout-troop",
    title: "Bea's Girl Scout Troop Hub",
    emoji: "👧",
    message:
      "A central hub for organizing Girl Scout troop activities and planning.",
    longDescription:
      "Built a dedicated site for my daughter's Girl Scout troop to coordinate meetings, activities, badge achievements, and family involvement. Helps the troop stay organized, communicate schedules, and celebrate accomplishments together.",
    image: "/images/gs.png",
    link: {
      href: "https://bea-troop-site.vercel.app/",
      label: "Girl Scout Troop",
    },
  },
   {
    slug: "uva",
    title: "UVA Sports Dashboard",
    emoji: "⚔️",
    message:
      "Your one-stop shop for UVA football and basketball.",
    longDescription:
      "Built a centralized hub to track upcoming UVA games, live scores, and game history for football and basketball. It's my go-to place to see what's coming up, reflect on past matchups, and stay connected with the sports I love.",
   link: {
      href: "https://www.mikewilley.app/uva",
      label: "UVA"},
   },
{
    slug: "shows",
    title: "Concerts & Live Shows Hub",
    emoji: "🎸",
    message:
      "Never miss a show from your favorite artists again.",
    longDescription:
      "I found myself constantly jumping between Ticketmaster, venue websites, and artist socials trying to stay on top of upcoming concerts. I built a unified hub that tracks my favorite bands and venues in one place, so I can see what's coming up, set reminders, and never miss an experience.",
   link: {
      href: "https://www.mikewilley.app/shows",
      label: "Shows"},
   },
  {
    slug: "vandy-accounting",
    title: "Vandy Accounting Website Redesign",
    emoji: "💼",
    message:
      "Modernized a professional accounting firm's web presence.",
    longDescription:
      "My aunt Julie runs an Accounting Solutions company in Indianapolis, and her website needed a fresh look. I completely redesigned and rebuilt it with modern UI/UX, mobile responsiveness, service highlights, and an easy way for clients to learn about her offerings and get in touch.",
      image: "/images/vandy-screenshot2.png",
      link: {
        href: "https://vandy-accounting-migration.vercel.app/",
        label: "Vandy Accounting",
      },
  },
  {
    slug: "vandy-dance",
    title: "Vandy Dance Studio Website",
    emoji: "💃",
    message:
      "Built a vibrant website for an independent dance studio.",
    longDescription:
      "Created a modern, engaging website for an independent dance studio to showcase their classes, schedule, and instructors. Features class calendars, registration information, and a welcoming design that captures the energy of the dance community.",
    image: "/images/vandy.png",
    link: {
      href: "https://vandy-dance.vercel.app/",
      label: "Vandy Dance",
    },
  },
  {
    slug: "workout-timer",
    title: "HIIT Workout Timer",
    emoji: "💪",
    message:
      "A smarter interval timer for high-intensity workouts.",
    longDescription:
      "The default phone clock app wasn't cutting it for HIIT training—no easy way to manage different intervals or customize workouts on the fly. I built a sleek, responsive timer that lets you create custom intervals, store your favorite routines, and crush your training sessions with real-time feedback.",
   link: {
      href: "https://www.mikewilley.app/workout-timer",
      label: "Workout Timer"},
   },
 {
    slug: "3d-rotunda",
    title: "3D Rotunda Christmas Project",
    emoji: "🏛️",
    message:
      "A family keepsake: a 3D-printed model of UVA's iconic Rotunda.",
    longDescription:
      "My daughter Bea designed and 3D-modeled the University of Virginia's Rotunda as a school project—and did an incredible job capturing every architectural detail. I had it 3D-printed to scale and gave it to my Dad as a Christmas present. It's now a beautiful family keepsake.",
    video: "/video/rotunda-3d-print.mp4"
        
  },
    {
    slug: "poster-generator",
    title: "AI-Powered Poster Generator",
    emoji: "🎨",
    message:
      "Create stunning dark-mode posters with AI assistance and local filters.",
    longDescription: "Upload a photo, add AI-generated taglines, apply artistic transforms (cartoon, sketch, anime, oil painting), customize fonts, borders, and text effects, then export in your choice of sizes. Features both server-side and client-side image transforms, so you always have a fast fallback ready.",
    link: {
      href: "https://www.mikewilley.app/poster-generator",
      label: "Poster"
      
    },
  },
 {
    slug: "gallery",
    title: "Dynamic Photo Gallery",
    emoji: "📸",
    message:
      "Browse your photo collection in a beautiful masonry layout.",
    longDescription: "A responsive photo gallery that auto-pulls images from your local directory and displays them in an elegant masonry grid. Includes lightbox viewing, filtering options, and fast load times thanks to optimized image handling.",
    link: {
      href: "https://www.mikewilley.app/gallery",
      label: "Gallery"
    },
  },
  {
    slug: "fairfax-community-revitalization-migration",
    title: "Fairfax Community Revitalization Migration",
    emoji: "📊",
    message:
      "Migrating a community initiative to the Fairfax County planning system.",
    longDescription:
      "Working on integrating the Orchard Community Revitalization (OCR) site into Fairfax County's Planning and Development department infrastructure. In progress—awaiting county email access to finalize the transition and unlock seamless integration.",
    image: "/images/fairfax-ocr2.png",
    link: {
      href: "https://www.fcrevite.org/",
      label: "fcrevite.org",
    },
  },
  {
    slug: "dpor",
    title: "DPOR Drupal Portal",
    emoji: "💼",
    message:
      "Professional licensing and regulation portal for Virginia.",
    longDescription:
      "Built a few years ago with Drupal, this site serves the Virginia Department of Professional and Occupational Regulation (DPOR), helping Virginians navigate licensing, permits, and regulatory compliance.",
     link: {
      href: "https://www.dpor.virginia.gov/",
      label: "DPOR"
  },
},
  {
    slug: "explain-it-beta",
    title: "Explain It (Beta)",
    emoji: "💡",
    message: "AI-powered tool to explain anything in simple terms.",
    longDescription:
      "Explain It (Beta) is an AI-powered tool that breaks down complex topics, documents, or code into clear, simple explanations. Paste text, upload a file, or enter a question—get a plain-language summary or step-by-step breakdown. Great for students, professionals, and anyone who wants to understand faster.",
    link: {
      href: "https://explain-it-beta.vercel.app/",
      label: "Explain It (Beta)",
    },
  },
  {
    slug: "collector",
    title: "Collector",
    emoji: "💎",
    message: "Upload photos of coins, bills, or sports cards. Get an ID and selling guidance.",
    longDescription: "Rookie Collector helps you identify and catalog your collectibles. Upload photos of coins, bills, or sports cards to get immediate identification and practical eBay selling guidance. Perfect for collectors looking to understand their collection's value.",
    link: {
      href: "https://collector-gold.vercel.app/",
      label: "Collector",
    },
  },
  {
    slug: "prompt-wizard",
    title: "Prompt Wizard",
    emoji: "🧙",
    message: "Craft better AI prompts with guided templates and best practices.",
    longDescription: "Prompt Wizard helps you write better prompts for ChatGPT, Claude, and other AI models. Get guided templates, learn prompt engineering best practices, refine your questions, and save your best prompts for future use. Perfect for anyone looking to get better results from AI.",
    link: {
      href: "https://prompt-wizard-woad.vercel.app/",
      label: "Prompt Wizard",
    },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}