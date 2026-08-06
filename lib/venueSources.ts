// lib/venueSources.ts
// Hybrid sources for “closest shows” on the Shows home page.
// TM = Ticketmaster Discovery; scrape = our Supabase venue_events monitor.

export type VenueRegionName = "Hampton Roads" | "Richmond" | "Washington DC";

export type VenueSource = {
  /** Display name */
  name: string;
  /** Venue site / calendar URL */
  url: string;
  region: VenueRegionName;
  source: "ticketmaster" | "scrape";
  /** Ticketmaster Discovery venueId when known */
  tmVenueId?: string;
  /** Substring match against TM venue.name (lowercase) */
  tmName?: string;
  /** Geo center for regional TM pulls */
  lat: string;
  lon: string;
};

const HR = { lat: "36.8508", lon: "-76.2859" };
const RVA = { lat: "37.5407", lon: "-77.4360" };
const DC = { lat: "38.9072", lon: "-77.0369" };

/**
 * Prefer TM when the room reliably sells there.
 * Others fall back to scraped venue_events from the monitor.
 */
export const venueSources: VenueSource[] = [
  // Hampton Roads — TM-heavy rooms
  {
    name: "The Dome",
    url: "https://www.ticketmaster.com/the-dome-tickets-virginia-beach/venue/9458",
    region: "Hampton Roads",
    source: "ticketmaster",
    tmVenueId: "9458",
    tmName: "dome",
    ...HR,
  },
  {
    name: "Veterans United Home Loans Amphitheater",
    url: "https://www.veteransunitedhomeloansamphitheater.com/shows",
    region: "Hampton Roads",
    source: "ticketmaster",
    tmName: "veterans united",
    ...HR,
  },
  {
    name: "The NorVa",
    url: "https://www.thenorva.com/calendar/",
    region: "Hampton Roads",
    source: "ticketmaster",
    tmName: "norva",
    ...HR,
  },
  // Hampton Roads — scrape / smaller rooms
  {
    name: "Elevation 27",
    url: "https://www.elevation27.com/calendar-2/",
    region: "Hampton Roads",
    source: "scrape",
    ...HR,
  },
  {
    name: "The Annex",
    url: "https://theannexnfk.com/events/",
    region: "Hampton Roads",
    source: "scrape",
    ...HR,
  },

  // Richmond
  {
    name: "The National",
    url: "https://www.thenationalva.com/schedule/",
    region: "Richmond",
    source: "ticketmaster",
    tmName: "the national",
    ...RVA,
  },
  {
    name: "Allianz Amphitheater at Riverfront",
    url: "https://www.allianzamphitheater.com/shows",
    region: "Richmond",
    source: "ticketmaster",
    tmName: "allianz",
    ...RVA,
  },
  {
    name: "The Broadberry",
    url: "https://thebroadberry.com/events/",
    region: "Richmond",
    source: "scrape",
    ...RVA,
  },
  {
    name: "The Camel",
    url: "https://www.thecamel.org/shows",
    region: "Richmond",
    source: "scrape",
    ...RVA,
  },
  {
    name: "Ember Music Hall",
    url: "https://embermusichall.com/events/",
    region: "Richmond",
    source: "scrape",
    ...RVA,
  },

  // DC
  {
    name: "The Anthem",
    url: "https://theanthemdc.com/calendar/",
    region: "Washington DC",
    source: "ticketmaster",
    tmName: "the anthem",
    ...DC,
  },
  {
    name: "9:30 Club",
    url: "https://www.930.com/e/listing/",
    region: "Washington DC",
    source: "ticketmaster",
    tmName: "9:30",
    ...DC,
  },
];

export function venuesByRegion(region: VenueRegionName) {
  return venueSources.filter((v) => v.region === region);
}
