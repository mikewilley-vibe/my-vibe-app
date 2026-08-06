// lib/uvaBasketballSchedule.ts
import { uvaGames as staticUvaGames } from "@/app/data/UvaSports";

const SCHEDULE_URL = "https://virginiasports.com/sports/mbball/schedule/";

export type UvaBasketballGame = {
  id: string;
  sport: "basketball";
  opponent: string;
  date: string;
  location: "home" | "away" | "neutral";
  result?: "win" | "loss" | "pending";
  note?: string;
  sourceUrl?: string;
  score?: string;
};

export type UvaBasketballScheduleResponse = {
  ok: boolean;
  status: number;
  updatedAt: string;
  games: UvaBasketballGame[];
  count: number;
  source: string;
  fallback?: boolean;
  scrapeError?: string;
};

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

function pickCityState(ev: {
  location?: {
    address?: { addressLocality?: string; name?: string };
    name?: string;
  };
}) {
  const loc =
    ev.location?.address?.addressLocality ||
    ev.location?.address?.name ||
    ev.location?.name ||
    "";
  return String(loc).trim();
}

function staticBasketballFallback(): UvaBasketballGame[] {
  return (staticUvaGames || [])
    .filter((g) => g.sport === "basketball")
    .map((g) => ({
      id: `uva-static-${g.id}`,
      sport: "basketball" as const,
      opponent: g.opponent,
      date: g.date.length <= 10 ? new Date(`${g.date}T19:00:00-05:00`).toISOString() : g.date,
      location: g.location,
      result: g.result ?? "pending",
      note: g.note,
      score: g.score,
    }));
}

export async function getUvaBasketballSchedule(): Promise<UvaBasketballScheduleResponse> {
  try {
    const res = await fetch(SCHEDULE_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html",
      },
    });

    let games: UvaBasketballGame[] = [];
    let scrapeError: string | undefined;

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const html = await res.text();

      if (html && (contentType.includes("text/html") || html.includes("<html"))) {
        const blocks = Array.from(
          html.matchAll(
            /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
          )
        ).map((m) => m[1]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events: any[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function pushPossibleEvents(node: any) {
          if (!node) return;
          if (Array.isArray(node)) return void node.forEach(pushPossibleEvents);
          if (Array.isArray(node["@graph"])) node["@graph"].forEach(pushPossibleEvents);
          if (Array.isArray(node.itemListElement)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            node.itemListElement.forEach((el: any) => pushPossibleEvents(el?.item ?? el));
          }
          if (node.startDate || node.name || node["@type"]) events.push(node);
        }

        for (const raw of blocks) {
          try {
            const parsed = JSON.parse(raw.trim());
            pushPossibleEvents(parsed);
          } catch {
            /* ignore malformed JSON-LD */
          }
        }

        const eventItems = events.filter(
          (e) =>
            (e?.["@type"] === "Event" || e?.["@type"] === "SportsEvent" || !!e?.startDate) &&
            !!e?.startDate &&
            !!e?.name
        );

        games = eventItems.map((ev) => {
          const { opponent, location } = normalizeOpponent(ev.name);
          const dateIso = ev.startDate
            ? new Date(ev.startDate).toISOString()
            : new Date().toISOString();
          const place = pickCityState(ev);

          return {
            id: `uva-mbb-${dateIso}-${opponent.replace(/\s+/g, "-").toLowerCase()}`,
            sport: "basketball" as const,
            opponent,
            date: dateIso,
            location,
            result: "pending" as const,
            note: place ? `Location: ${place}` : undefined,
            sourceUrl: ev.url || undefined,
          };
        });

        games = Array.from(new Map(games.map((g) => [g.id, g])).values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } else {
        scrapeError = "Non-HTML response or missing HTML content.";
      }
    } else {
      scrapeError = `Upstream not ok: ${res.status} ${res.statusText}`;
    }

    if (!games.length) {
      games = staticBasketballFallback();
      scrapeError = scrapeError || "No games found in scrape; using static fallback.";
    }

    return {
      ok: true,
      status: 200,
      updatedAt: new Date().toISOString(),
      games,
      count: games.length,
      source: SCHEDULE_URL,
      fallback: !!scrapeError,
      scrapeError,
    };
  } catch (err: unknown) {
    const games = staticBasketballFallback();
    return {
      ok: true,
      status: 200,
      updatedAt: new Date().toISOString(),
      games,
      count: games.length,
      source: SCHEDULE_URL,
      fallback: true,
      scrapeError: err instanceof Error ? err.message : String(err),
    };
  }
}
