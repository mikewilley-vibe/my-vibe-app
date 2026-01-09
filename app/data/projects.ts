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
   {
    slug: "orchard-house-basketball",
    title: "Orchard House Middle School Basketball",
    emoji: "🏀",
    message:
      "I'm helping coach my daughter's middle school basketball team.",
    longDescription:
      "There wasn't a hub for the team schedule, game locations, jersey colors etc., so I made one for us all to use.  Turned out pretty nice!",
    image: "/images/gryphons.png",
    link: {
      href: "https://orchardhousebasketball.org",
      label: "Orchard House Hoops",
  },
   },
  {
    slug: "workout-timer",
    title: "HIIT Workout Timer",
    emoji: "💪",
    message:
      "Made a HIIT timer for my workuts",
    longDescription:
      "The clock app doesn't work very well for timing different intervals, so I created my own etimer that you can edit for individual workouts.",
   link: {
      href: "https://www.mikewilley.app/workout-timer",
      label: "Workout Timer"},
   },
  {
    slug: "vandy-accounting",
    title: "Vandy Accounting Website Rehaul",
    emoji: "💼",
    message:
      "Created a new website for Vandy Accounting.",
    longDescription:
      "My aunt Julie has an Accounting Solutions company in Indianapolis and I remade her website. ",
      image: "/images/vandy-screenshot2.png"
      
  },
{
    slug: "shows",
    title: "Concerts Coming Up",
    emoji: "🎸",
    message:
      "Created a central hub for my favorite bands and venues.",
    longDescription:
      "I found myself clicking through various different websites trying to figure out what concerts were coming uop and occasionally missing some that I wanted to go to.",
   link: {
      href: "https://www.mikewilley.app/shows",
      label: "Shows"},
   },

   {
    slug: "uva",
    title: "Uva Sports Hub",
    emoji: "⚔️",
    message:
      "Created a centralized location for the UVA sports that I'm into",
    longDescription:
      "This is an easy place for me to see what games are coming uo and reflect back on the games I watched,",
   link: {
      href: "https://www.mikewilley.app/uva",
      label: "UVA"},
   },
    {
    slug: "poster-generator",
    title: "Poster Generator",
    emoji: "🎨",
    message:
      "Space to create posterrs with pictures",
    longDescription: "Generate dark-mode posters from your photos with filters, borders, custom fonts, and export sizes.",
    link: {
      href: "https://www.mikewilley.app/poster-generator",
      label: "Poster"
      
    },
  },
 {
    slug: "gallery",
    title: "Photo Gallery",
    emoji: "📸",
    message:
      "Gallery of my pics",
    longDescription: "Auto-pulls images from /public/gallery into a masonry-style gallery with filters and lightbox.",
    link: {
      href: "https://www.mikewilley.app/poster-generator",
      label: "Poster"
    },
  },
  {
    slug: "fairfax-community-revitalization-migration",
    title: "Fairfax Community Revitalization Migration",
    emoji: "📊",
    message:
      "Migrating the Current OCR site to be included in Fairfax County's Planning and Development",
    longDescription:
      "Still seeking Fairfax County email address to allow us to have access",
    image: "/images/fairfax-ocr2.png",
    link: {
      href: "https://www.fcrevite.org/",
      label: "fcrevite.org",
    },
  },
  
  
  {
    slug: "dpor",
    title: "DPOR Drupal Site",
    emoji: "💼",
    message:
      "Virginia Department of Professional and Occupational Regulation",
    longDescription:
      "This is a site I made in Drupal a few years ago.",
     link: {
      href: "https://www.dpor.virginia.gov/",
      label: "DPOR"
  },
},
 {
    slug: "3d-rotunda",
    title: "3D Rotunda Christmas Project",
    emoji: "🏛️",
    message:
      "My daughter Bea is at the head of her class and she designed and created a 3D model of the Rotunda.",
    longDescription:
      "This was such a cool project and was a perfect Christmas peresent to give to my Dad",
    video: "/video/rotunda-3d-print.mp4"
        
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}