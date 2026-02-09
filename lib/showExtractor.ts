import * as cheerio from "cheerio";
import crypto from "crypto";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function normalizeText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

export type ExtractedEvent = {
  title: string;
  event_date?: string | null;
  event_url?: string | null;
  fingerprint: string;
};

export function extractEventsFromHtml(args: {
  html: string;
  baseUrl: string;
  selector?: string | null;
}): { events: ExtractedEvent[]; contentHash: string } {
  const { html, baseUrl, selector } = args;
  const $ = cheerio.load(html);

  // If a selector exists, scope to that region; else use body text as fallback.
  const scope = selector ? $(selector) : $("body");

  const scopeText = normalizeText(scope.text());
  const contentHash = sha256(scopeText);

  // Try to extract links that look like event entries.
  // This is intentionally generic; you can refine per venue by setting selector.
  const links = scope.find("a").toArray();

  const candidates: ExtractedEvent[] = [];
  for (const el of links) {
    const a = $(el);
    const title = normalizeText(a.text());
    const href = a.attr("href");

    if (!title || title.length < 4) continue;
    if (!href) continue;

    const absUrl = href.startsWith("http")
      ? href
      : new URL(href, baseUrl).toString();

    // naive date sniffing from nearby text (optional)
    const parentText = normalizeText(a.parent().text());
    const dateMatch =
      parentText.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b.*?\b\d{1,2}\b.*?\b\d{4}\b/i) ||
      parentText.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);

    const event_date = dateMatch ? dateMatch[0] : null;

    const fingerprint = sha256(
      normalizeText(`${title}|${event_date ?? ""}|${absUrl}`)
    );

    candidates.push({ title, event_date, event_url: absUrl, fingerprint });
  }

  // Dedupe by fingerprint and keep the most plausible ones
  const byFp = new Map<string, ExtractedEvent>();
  for (const c of candidates) byFp.set(c.fingerprint, c);

  // Heuristic: many sites have lots of nav links; keep only links inside scope,
  // and cap to first N after sorting by title length (longer titles tend to be events).
  const events = Array.from(byFp.values())
    .sort((a, b) => (b.title.length ?? 0) - (a.title.length ?? 0))
    .slice(0, 80);

  return { events, contentHash };
}
