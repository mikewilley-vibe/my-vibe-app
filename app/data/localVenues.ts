export type LocalVenue = {
  name: string;
  url: string;
  image?: string;
};

export type VenueRegion = {
  region: "Hampton Roads" | "Richmond" | "Washington DC";
  venues: LocalVenue[];
};

export const localVenuesByRegion: VenueRegion[] = [
  {
    region: "Hampton Roads",
    venues: [
      {
    name: "The NorVa",
    url: "https://www.thenorva.com/events/",
    image: "/images/the-norva.jpg",
  },
    {
    name: "The Dome",
    url: "https://www.ticketmaster.com/the-dome-tickets-virginia-beach/venue/9458",
    image: "/images/the-dome.jpg",
  },
  {
    name: "The National",
    url: "https://www.thenationalva.com/events/",
    image: "/images/the-national.jpg",
  },
 
  {
    name: "Elevation 27",
    url: "https://www.elevation27.com/events",
    image: "/images/elevation-27.jpg",
  },
  {
  name: "The Annex",
  url: "https://theannexnfk.com/events/",
  image: "/images/the-annex.jpg",
},
{
  name: "Veterans United Home Loans Amphitheater (Virginia Beach)",
  url: "https://www.livenation.com/venue/KovZpZAE7EA/veterans-united-home-loans-amphitheater-at-virginia-beach-events",
  image: "/images/vb-amphitheater.jpg",
},
 ],
  },
  {
    region: "Richmond",
    venues: [
         {
    name: "The Broadberry",
    url: "https://thebroadberry.com/events/",
    image: "/images/the-broadberry.jpg",
  },
    {
    name: "Allianz Amphitheater at Riverfront",
    url: "https://www.ticketmaster.com/allianz-amphitheater-at-riverfront-tickets-richmond/venue/9456",
    image: "/images/allianz-amphitheater.jpg",
  },
  {
    name: "Richmond Music Hall",
    url: "https://www.capitalalehouse.com/richmond-music-hall/",
    image: "/images/richmond-music-hall.jpg",
  },


  {
    name: "The Camel",
    url: "https://thecamel.org/events/",
    image: "/images/the-camel.jpg",
  },
  {
    name: "Gallery5",
    url: "https://gallery5arts.org/calendar/",
    image: "/images/gallery5.jpg",
  },
  {
    name: "Ember Music Hall",
    url: "https://www.embermusichall.com/events",
    image: "/images/ember-music-hall.jpg",
  },


  {
    name: "Brown's Island",
    url: "https://www.brownsisland.com/events",
    image: "/images/browns-island.jpg",
  },

  ],
  },
  {
    region: "Washington DC",
    venues: [
         {
    name: "9:30 Club",
    url: "https://www.930.com/e/listing/",
    image: "/images/930-club.jpg",
  },
  {
    name: "The Anthem",
    url: "https://theanthemdc.com/events/",
    image: "/images/the-anthem.jpg",
  },
  {
    name: "Black Cat",
    url: "https://www.blackcatdc.com/schedule/",
    image: "/images/black-cat.jpg",
  },
  {
    name: "Lincoln Theatre",
    url: "https://lincolntheatre-dc.org/events/",
    image: "/images/lincoln-theatre.jpg",
  },
  
],

  },
];
export const __debug_localVenuesByRegion_exists = true;