// lib/annexScraper.ts
// Live scrape of https://theannexnfk.com/events/ (Rainmaker / RHP listings).
import https from "node:https";
import * as cheerio from "cheerio";

export type AnnexShow = {
  id: string;
  title: string;
  date: string | null;
  url: string | null;
  source: "scrape";
};

const ANNEX_EVENTS_URL = "https://theannexnfk.com/events/";

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function fetchHtml(url: string, timeoutMs = 12_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "user-agent":
            "mikewilley.app show monitor (+https://www.mikewilley.app/shows)",
          accept: "text/html",
        },
        timeout: timeoutMs,
      },
      (res) => {
        if ((res.statusCode ?? 500) >= 400) {
          res.resume();
          reject(new Error(`Annex HTTP ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      }
    );
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Annex request timed out"));
    });
    req.on("error", reject);
  });
}

function parseAnnexDay(label: string, yearHint: number): Date | null {
  // "Fri, Aug 07"
  const m = label.match(
    /\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s+([a-z]{3,9})\s+(\d{1,2})\b/i
  );
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (month == null) return null;
  const day = Number(m[2]);
  const d = new Date(yearHint, month, day, 20, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function scrapeAnnexUpcoming(limit = 3): Promise<AnnexShow[]> {
  const html = await fetchHtml(ANNEX_EVENTS_URL);
  const $ = cheerio.load(html);

  let yearHint = new Date().getFullYear();
  const shows: AnnexShow[] = [];
  const seen = new Set<string>();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Month headings on the events page ("August 2026") appear as plain text blocks.
  const monthYearRe =
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(20\d{2})\b/i;

  $("body *").each((_, el) => {
    const node = $(el);
    const ownText = node
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const ym = ownText.match(monthYearRe);
    if (ym && ownText.length < 40) {
      yearHint = Number(ym[2]);
    }

    if (!node.is("a.url")) return;
    const href = node.attr("href") || "";
    if (!href.includes("/event/") || seen.has(href)) return;

    const title = (node.attr("title") || node.text()).replace(/\s+/g, " ").trim();
    if (!title || title.length < 3) return;

    const dateLabel = node
      .find("#eventDate, .eventMonth, .singleEventDate")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    let parsed = parseAnnexDay(dateLabel, yearHint);
    if (parsed && parsed < now) {
      parsed = parseAnnexDay(dateLabel, yearHint + 1);
    }
    if (!parsed || parsed < now) return;

    let ticketUrl = href;
    let p = node;
    for (let i = 0; i < 10; i++) {
      p = p.parent();
      if (!p.length) break;
      const hit = p.find('a[href*="etix.com"]').first().attr("href");
      if (hit) {
        ticketUrl = hit;
        break;
      }
      if (p.is("body") || p.is("main") || p.is("section")) break;
    }

    seen.add(href);
    shows.push({
      id: `annex-${parsed.getTime()}-${shows.length}`,
      title,
      date: parsed.toISOString(),
      url: ticketUrl,
      source: "scrape",
    });
  });

  return shows
    .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
    .slice(0, limit);
}
