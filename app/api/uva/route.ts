// app/api/uva/route.ts
import { NextResponse } from "next/server";

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

function normalizeOpponent(name?: string) {
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

export async function GET() {
  try {
    const res = await fetch(SCHEDULE_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html",
      },
    });

    // ✅ WRAP #1
    if (!res.ok) {
      console.error("[UVA] Upstream not ok:", res.status, res.statusText);
      return NextResponse.json({
        ok: false,
        status: res.status,
        updatedAt: new Date().toISOString(),
        games: [],
        count: 0,
        source: SCHEDULE_URL,
      });
    }

    // ✅ WRAP #2
    const contentType = res.headers.get("content-type") || "";
    const html = await res.text();

    if (!html || (!contentType.includes("text/html") && !html.includes("<html"))) {
      console.error("[UVA] Non-HTML response:", contentType, html.slice(0, 120));
      return NextResponse.json({
        ok: false,
        status: 200,
        updatedAt: new Date().toISOString(),
        games: [],
        count: 0,
        source: SCHEDULE_URL,
      });
    }

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

    const games: UvaGame[] = eventItems.map((ev: any) => {
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

    const deduped: UvaGame[] = Array.from(
      new Map(games.map((g) => [g.id, g])).values()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      ok: true,
      status: 200,
      updatedAt: new Date().toISOString(),
      games: deduped,
      count: deduped.length,
      source: SCHEDULE_URL,
    });
  } catch (err: any) {
    console.error("[UVA] Exception:", err);
    return NextResponse.json({
      ok: false,
      status: 200,
      updatedAt: new Date().toISOString(),
      games: [],
      count: 0,
      source: SCHEDULE_URL,
      error: String(err?.message ?? err),
    });
  }
}