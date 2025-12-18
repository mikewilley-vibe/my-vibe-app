// app/api/uva/route.ts
import { NextResponse } from "next/server";

const SCHEDULE_URL = "https://virginiasports.com/sports/mbball/schedule/";

// NOTE: VirginiaSports JSON-LD uses @graph / ItemList wrappers

type JsonLdEvent = {
  "@type"?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  url?: string;
  location?: {
    name?: string;
    address?: {
      name?: string;
      addressLocality?: string;
      addressRegion?: string;
    };
  };
};

type UvaGame = {
  id: string;
  sport: "basketball";
  opponent: string;
  date: string; // ISO-ish
  location: "home" | "away" | "neutral";
  result: "pending"; // we’ll add results later if you want
  score?: string;
  note?: string;
  sourceUrl?: string;
};

function normalizeOpponent(name?: string) {
  const n = (name ?? "").trim();
  // VirginiaSports names look like "Virginia vs. Duke" / "Virginia at Duke"
  const lower = n.toLowerCase();

  if (lower.includes(" vs. ")) {
    return { opponent: n.split(/ vs\. /i)[1]?.trim() || "Opponent TBA", location: "home" as const };
  }
  if (lower.includes(" at ")) {
    return { opponent: n.split(/ at /i)[1]?.trim() || "Opponent TBA", location: "away" as const };
  }
  // fallback
  return { opponent: n || "Opponent TBA", location: "neutral" as const };
}

function pickCityState(ev: JsonLdEvent) {
  const loc =
    ev.location?.address?.addressLocality ||
    ev.location?.address?.name ||
    ev.location?.name ||
    "";
  return String(loc).trim();
}

export async function GET() {
  try {
    const res = await fetch(SCHEDULE_URL, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html",
      },
    });

    const html = await res.text();

    // Pull JSON-LD scripts
const blocks = Array.from(
  html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )
).map((m) => m[1]);

const events: JsonLdEvent[] = [];

function pushPossibleEvents(node: any) {
  if (!node) return;

  // If it's an array, recurse into each item
  if (Array.isArray(node)) {
    node.forEach(pushPossibleEvents);
    return;
  }

  // Common JSON-LD wrappers
  if (Array.isArray(node["@graph"])) {
    node["@graph"].forEach(pushPossibleEvents);
  }

  if (Array.isArray(node.itemListElement)) {
    // itemListElement can be objects with `.item`
    node.itemListElement.forEach((el: any) => pushPossibleEvents(el?.item ?? el));
  }

  // If it looks like an event-ish object, keep it
  if (node.startDate || node.name || node["@type"]) {
    events.push(node);
  }
}

for (const raw of blocks) {
  try {
    const parsed = JSON.parse(raw.trim());
    pushPossibleEvents(parsed);
  } catch {
    // ignore unparseable block
  }
}

    // Keep only Event/SportsEvent-ish items with startDate
    const eventItems = events.filter(
      (e) =>
        (e?.["@type"] === "Event" || e?.["@type"] === "SportsEvent" || !!e?.startDate) &&
        !!e?.startDate &&
        !!e?.name
    );

    const games: UvaGame[] = eventItems.map((ev) => {
      const { opponent, location } = normalizeOpponent(ev.name);
      const dateIso = ev.startDate ? new Date(ev.startDate).toISOString() : new Date().toISOString();
      const place = pickCityState(ev);

      return {
        id: `uva-mbb-${dateIso}-${opponent.replace(/\s+/g, "-").toLowerCase()}`,
        sport: "basketball",
        opponent,
        date: dateIso,
        location,
        result: "pending",
        note: place ? `Location: ${place}` : undefined,
        sourceUrl: ev.url || undefined,
      };
    });

    // Dedup + sort
    const deduped = Array.from(new Map(games.map((g) => [g.id, g])).values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      updatedAt: new Date().toISOString(),
      games: deduped,
      count: deduped.length,
      source: SCHEDULE_URL,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}