// lib/venueUpcoming.ts
import { fetchTMEvents } from "@/lib/ticketmaster";
import type { Concert } from "@/lib/concerts/types";
import { supabaseServer } from "@/lib/supabaseServer";
import {
  venueSources,
  type VenueRegionName,
  type VenueSource,
} from "@/lib/venueSources";

export type VenueUpcomingShow = {
  id: string;
  title: string;
  date: string | null;
  url: string | null;
  source: "ticketmaster" | "scrape";
};

export type VenueUpcomingGroup = {
  venue: VenueSource;
  shows: VenueUpcomingShow[];
  error?: string;
};

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

function norm(s: string) {
  return s.toLowerCase().trim();
}

function parseLooseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const raw = value.trim();
  // ISO-ish
  const iso = new Date(raw.length <= 10 ? `${raw}T12:00:00` : raw);
  if (!Number.isNaN(iso.getTime())) return iso;

  // "Aug 12, 2026" / "August 12 2026"
  const mdy = Date.parse(raw);
  if (!Number.isNaN(mdy)) return new Date(mdy);

  // "8/12/2026"
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    const y = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
    const d = new Date(Number(y), Number(slash[1]) - 1, Number(slash[2]), 12);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function matchesTmVenue(concert: Concert, source: VenueSource) {
  const venueName = norm(concert.venue || "");
  if (!venueName) return false;
  if (source.tmName && venueName.includes(norm(source.tmName))) return true;
  // light fallback on configured display name
  const tokens = norm(source.name)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 3);
  return tokens.some((t) => venueName.includes(t));
}

async function fetchRegionTmEvents(region: VenueRegionName, days: number): Promise<Concert[]> {
  const sample = venueSources.find((v) => v.region === region);
  if (!sample) return [];

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  return fetchTMEvents({
    classificationName: "music",
    latlong: `${sample.lat},${sample.lon}`,
    radius: region === "Washington DC" ? "25" : "60",
    unit: "miles",
    sort: "date,asc",
    startDateTime: tmIso(start),
    endDateTime: tmIso(end),
    size: "100",
  });
}

async function fetchTmForVenueId(source: VenueSource, days: number): Promise<Concert[]> {
  if (!source.tmVenueId) return [];
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  return fetchTMEvents({
    classificationName: "music",
    venueId: source.tmVenueId,
    sort: "date,asc",
    startDateTime: tmIso(start),
    endDateTime: tmIso(end),
    size: "20",
  });
}

async function loadScrapedByVenueName(limitPerVenue: number) {
  const supabase = supabaseServer();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("venue_events")
    .select("id, title, event_date, event_url, venues(name)")
    .order("event_date", { ascending: true })
    .limit(400);

  if (error) throw new Error(error.message);

  type Row = {
    id: string;
    title: string;
    event_date: string | null;
    event_url: string | null;
    venues: { name: string } | { name: string }[] | null;
  };

  const byVenue = new Map<string, VenueUpcomingShow[]>();

  for (const row of (data ?? []) as Row[]) {
    const venueRel = row.venues;
    const name = Array.isArray(venueRel)
      ? venueRel[0]?.name
      : venueRel?.name;
    if (!name) continue;

    const parsed = parseLooseDate(row.event_date);
    // Keep undated scrape rows only when we have almost nothing? Prefer dated future only.
    if (!parsed || parsed < today) continue;

    const key = norm(name);
    const list = byVenue.get(key) ?? [];
    if (list.length >= limitPerVenue) continue;
    list.push({
      id: row.id,
      title: row.title,
      date: parsed.toISOString(),
      url: row.event_url,
      source: "scrape",
    });
    byVenue.set(key, list);
  }

  return byVenue;
}

function findScrapedMatches(
  scraped: Map<string, VenueUpcomingShow[]>,
  source: VenueSource
) {
  const needle = norm(source.name);
  // exact / contains either way
  for (const [key, shows] of scraped.entries()) {
    if (key.includes(needle) || needle.includes(key)) return shows;
    // token overlap
    if (needle.split(/\s+/).filter((t) => t.length > 3).some((t) => key.includes(t))) {
      return shows;
    }
  }
  return [];
}

/**
 * Closest upcoming shows for each configured venue.
 * Ticketmaster rooms: regional Discovery pulls (plus venueId when known).
 * Others: scraped Supabase venue_events.
 */
export async function getClosestShowsPerVenue(opts?: {
  perVenue?: number;
  days?: number;
}): Promise<VenueUpcomingGroup[]> {
  const perVenue = opts?.perVenue ?? 3;
  const days = opts?.days ?? 120;

  const tmVenues = venueSources.filter((v) => v.source === "ticketmaster");
  const scrapeVenues = venueSources.filter((v) => v.source === "scrape");
  const regions = Array.from(new Set(tmVenues.map((v) => v.region)));

  const [regionResults, idResults, scraped] = await Promise.all([
    Promise.allSettled(regions.map((r) => fetchRegionTmEvents(r, days))),
    Promise.allSettled(
      tmVenues
        .filter((v) => v.tmVenueId)
        .map(async (v) => ({ venue: v.name, events: await fetchTmForVenueId(v, days) }))
    ),
    loadScrapedByVenueName(perVenue).catch(() => new Map<string, VenueUpcomingShow[]>()),
  ]);

  const regionalConcerts: Concert[] = [];
  regionResults.forEach((r) => {
    if (r.status === "fulfilled") regionalConcerts.push(...r.value);
  });

  const byVenueId = new Map<string, Concert[]>();
  idResults.forEach((r) => {
    if (r.status === "fulfilled") byVenueId.set(norm(r.value.venue), r.value.events);
  });

  const now = Date.now();

  const groups: VenueUpcomingGroup[] = venueSources.map((venue) => {
    if (venue.source === "ticketmaster") {
      const fromId = byVenueId.get(norm(venue.name)) ?? [];
      const fromRegion = regionalConcerts.filter((c) => matchesTmVenue(c, venue));
      const merged = [...fromId, ...fromRegion];

      const seen = new Set<string>();
      const shows: VenueUpcomingShow[] = [];
      for (const c of merged.sort(
        (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )) {
        if (!c.dateTime || new Date(c.dateTime).getTime() < now) continue;
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        shows.push({
          id: c.id,
          title: c.name,
          date: c.dateTime,
          url: c.url,
          source: "ticketmaster",
        });
        if (shows.length >= perVenue) break;
      }

      // If TM missed, fall back to scrape monitor by name
      if (shows.length === 0) {
        return {
          venue,
          shows: findScrapedMatches(scraped, venue).slice(0, perVenue),
          error: "No Ticketmaster listings — showing scrape fallback if available",
        };
      }

      return { venue, shows };
    }

    return {
      venue,
      shows: findScrapedMatches(scraped, venue).slice(0, perVenue),
    };
  });

  // Prefer venues that actually have shows, but keep empty ones at the end for transparency
  return [
    ...groups.filter((g) => g.shows.length > 0),
    ...groups.filter((g) => g.shows.length === 0),
  ];
}
