export type MyArtist = {
  name: string;
  url: string;        // ✅ required, same as LocalVenue
  image?: string;
};

export const myArtists: MyArtist[] = [
  { name: "Badfish", url: "https://www.badfish.com/tour", image: "/images/badfish.jpg" },

  // Use “good enough for now” links until you replace with official ones:
  { name: "The Disco Biscuits", url: "https://www.discobiscuits.com/shows", image: "/images/discobiscuits.jpg" },
  { name: "Chalk Dinosaur", url: "https://chalkdinosaur.com/shows", image: "/images/cd.jpg" },
  { name: "Spafford", url: "https://www.spafford.net/tour.html", image: "/images/spafford.jpg" },
  { name: "Built to Spill", url: "https://www.builttospill.com/shows", image: "/images/bts.jpg" },
  { name: "Phish", url: "https://www.ticketmaster.com/search?q=Phish", image: "/images/phish.jpg"  },
  { name: "Kishi Bashi", url: "https://www.kishibashi.com/shows", image: "/images/kb.png" },
  { name: "Sunsquabi", url: "https://www.sunsquabi.com/tour-dates", image: "/images/SunSquabi.jpg" },
  { name: "STS9", url: "https://sts9.com/#shopify-section-template--16937852502067__custom_liquid_B8tTGU", image: "/images/STS9.jpg" },
  { name: "The New Deal", url: "https://www.thenewdeal.com/tour", image: "/images/theNEWDEAL.jpg" },
  { name: "Lettuce", url: "https://www.lettucefunk.com/tour", image: "/images/Lettuce.jpg" },
  { name: "Robert Randolph", url: "https://www.robertrandolph.net/home#dates", image: "/images/RobertRandolph.webp" },
  { name: "Goose", url: "https://www.goosetheband.com/tour", image: "/images/Goose.webp" },
  { name: "Widespread Panic", url: "https://www.widespreadpanic.com/tour", image: "/images/WidespreadPanic.webp" },
  { name: "Billy Strings", url: "https://www.billystrings.com/tour", image: "/images/BillyStrings.webp" },
  { name: "Umphrey's McGee", url: "https://www.umphreysmcgee.com/tour", image: "/images/umphreysmcgee.webp" },
  { name: "STRFKR", url: "https://strfkr.com/tour", image: "/images/strfkr.webp" },
  { name: "Galactic", url: "https://galacticfunk.com/tour", image: "/images/Galactic.webp" },
  { name: "LCD Soundsystem", url: "https://www.lcdsoundsystem.com/tour", image: "/images/LCDSoundsystem.webp" },
  { name: "Tame Impala", url: "https://www.tameimpala.com/tour", image: "/images/TameImpala.webp" },
  { name: "Pavement", url: "https://www.jambase.com/band/pavement", image: "/images/pavement.jpg" },
  { name: "Futurebirds", url: "https://www.futurebirds.com/tour", image: "/images/Futurebirds.webp" },

];