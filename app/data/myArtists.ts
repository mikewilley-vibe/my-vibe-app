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
  { name: "Grateful Jed", url: "https://www.gratefuljed.com/tour", image: "/images/placeholder.svg" },
  { name: "Sunsquabi", url: "https://www.sunsquabi.com/tour", image: "/images/placeholder.svg" },
  { name: "STS9", url: "https://www.sts9.com/tour", image: "/images/placeholder.svg" },
  { name: "The New Deal", url: "https://www.thenewdeal.com/tour", image: "/images/placeholder.svg" },
  { name: "Lettuce", url: "https://www.lettucemusic.com/tour", image: "/images/placeholder.svg" },
  { name: "Robert Randolph", url: "https://www.robertrandolph.com/tour", image: "/images/placeholder.svg" },
  { name: "Goose", url: "https://www.goosemusic.com/tour", image: "/images/placeholder.svg" },
  { name: "Widespread Panic", url: "https://www.widespreadpanic.com/tour", image: "/images/placeholder.svg" },
  { name: "Billy Strings", url: "https://www.billystrings.com/tour", image: "/images/placeholder.svg" },
  { name: "Umphrey's McGee", url: "https://www.umphreysmcgee.com/tour", image: "/images/placeholder.svg" },
  { name: "STRFKR", url: "https://www.starfucker.net/tour", image: "/images/placeholder.svg" },
  { name: "Galactic", url: "https://www.galacticgroove.com/tour", image: "/images/placeholder.svg" },
  { name: "LCD Soundsystem", url: "https://www.lcdsoundsystem.com/tour", image: "/images/placeholder.svg" },
  { name: "Tame Impala", url: "https://www.tameimpala.com/tour", image: "/images/placeholder.svg" },

];