export type MyArtist = {
  name: string;
  url: string;        // ✅ required, same as LocalVenue
  image?: string;
};

export const myArtists: MyArtist[] = [
  { name: "Badfish", url: "https://www.badfish.com/tour", image: "images/badfish.jpg" },

  // Use “good enough for now” links until you replace with official ones:
  { name: "The Disco Biscuits", url: "https://www.discobiscuits.com/shows", image: "images/discobiscuits.jpg" },
  { name: "Chalk Dinosaur", url: "https://chalkdinosaur.com/shows", image: "images/cd.jpg" },
  { name: "Spafford", url: "https://www.spafford.net/tour.html", image: "images/spafford.jpg" },
  { name: "Built to Spill", url: "https://www.builttospill.com/shows", image: "images/bts.jpg" },
  { name: "Phish", url: "https://www.ticketmaster.com/search?q=Phish", image: "images/phish.jpg"  },
  { name: "Kishi Bashi", url: "https://www.kishibashi.com/shows", image: "images/kb.png" },
  { name: "Grateful Jed", url: "https://www.gratefuljed.com/tour", image: "images/gratefuljed.jpg" },

];