// app/api/uva/route.ts

import { NextResponse } from "next/server";
import { uvaGames as staticUvaGames } from "@/app/data/UvaSports";

const SCHEDULE_URL = "https://virginiasports.com/sports/mbball/schedule/";

type UvaGame = {
  id: string;
  sport: "basketball";
  opponent: string;
  date: string; // ISO
  location: "home" | "away" | "neutral";
  result: "pending"; // schedule-only here
  note?: string;
  sourceUrl?: string;
};

export async function GET() {
  function normalizeOpponent(name: string) {
    const n = (name ?? "").trim();
    const lower = n.toLowerCase();

    if (lower.includes(" vs. ")) {
      return {
        opponent: n.split(/ vs\. /i)[1]?.trim() || "Opponent TBA",
        location: "home" as const,
      };
    }
    if (lower.includes(" at ")) {
      return {
        opponent: n.split(/ at /i)[1]?.trim() || "Opponent TBA",
        location: "away" as const,
      };
    }
    return { opponent: n || "Opponent TBA", location: "neutral" as const };
  }

  function pickCityState(ev: any) {
    const loc =
      ev.location?.address?.addressLocality ||
      ev.location?.address?.name ||
      ev.location?.name ||
      "";
    return String(loc).trim();
  }

  let response;
  try {
    const res = await fetch(SCHEDULE_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html",
      },
    });

    let games: UvaGame[] = [];
    let scrapeError: string | undefined = undefined;

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const html = await res.text();

      if (html && (contentType.includes("text/html") || html.includes("<html"))) {
        // Pull JSON-LD scripts
        const blocks = Array.from(
          html.matchAll(
            /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
          )
        ).map((m) => m[1]);

        const events: any[] = [];

        function pushPossibleEvents(node: any) {
          if (!node) return;
          if (Array.isArray(node)) return void node.forEach(pushPossibleEvents);
          if (Array.isArray(node["@graph"])) node["@graph"].forEach(pushPossibleEvents);
          if (Array.isArray(node.itemListElement)) {
            node.itemListElement.forEach((el: any) => pushPossibleEvents(el?.item ?? el));
          }
          if (node.startDate || node.name || node["@type"]) events.push(node);
        }

        for (const raw of blocks) {
          try {
            const parsed = JSON.parse(raw.trim());
            pushPossibleEvents(parsed);
          } catch {}
        }

        const eventItems = events.filter(
          (e) =>
            (e?.["@type"] === "Event" || e?.["@type"] === "SportsEvent" || !!e?.startDate) &&
            !!e?.startDate &&
            !!e?.name
        );

        games = eventItems.map((ev: any) => {
          const { opponent, location } = normalizeOpponent(ev.name);
          const dateIso = ev.startDate
            ? new Date(ev.startDate).toISOString()
            : new Date().toISOString();
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

        games = Array.from(
          new Map(games.map((g) => [g.id, g])).values()
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        scrapeError = "Non-HTML response or missing HTML content.";
      }
    } else {
      scrapeError = `Upstream not ok: ${res.status} ${res.statusText}`;
    }

    // Fallback to static data if no games found
    if (!games.length) {
      games = (staticUvaGames || [])
        .filter((g) => g.sport === "basketball")
        .map((g) => ({
          ...g,
          result: g.result ?? "pending",
          id: typeof g.id === "number" ? `uva-static-${g.id}` : g.id,
        }));
      scrapeError = scrapeError || "No games found in scrape; using static fallback.";
    }

    response = {
      ok: true,
      status: 200,
      updatedAt: new Date().toISOString(),
      games,
      count: games.length,
      source: SCHEDULE_URL,
      fallback: !!scrapeError,
      scrapeError,
    };
  } catch (err: any) {
    // On error, fallback to static data
    const games = (staticUvaGames || [])
      .filter((g) => g.sport === "basketball")
      .map((g) => ({
        ...g,
        result: g.result ?? "pending",
        id: typeof g.id === "number" ? `uva-static-${g.id}` : g.id,
      }));
    response = {
      ok: true,
      status: 200,
      updatedAt: new Date().toISOString(),
      games,
      count: games.length,
      source: SCHEDULE_URL,
      fallback: true,
      scrapeError: String(err?.message ?? err),
    };
  }
  return NextResponse.json(response);
}