export const UVA_ORANGE = "#F84C1E";
export const UVA_BLUE = "#232D4B";

export type UvaResultGame = {
  dateIso: string;
  opponent: string;
  score: string;
  homeAway?: "home" | "away" | "neutral";
  sourceUrl?: string;
};

export function parseResultScore(score: string) {
  const s = String(score ?? "").trim();
  const wl = s.startsWith("W") ? "W" : s.startsWith("L") ? "L" : null;
  const nums = s.match(/(\d+)\D+(\d+)/);
  const a = nums ? Number(nums[1]) : null;
  const b = nums ? Number(nums[2]) : null;
  return { wl, a, b };
}

export function fmtResultDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

export function calcRecord(results: UvaResultGame[]) {
  let w = 0;
  let l = 0;
  for (const r of results) {
    const { wl } = parseResultScore(r.score);
    if (wl === "W") w++;
    else if (wl === "L") l++;
  }
  return { w, l };
}

export function chipMeta(homeAway?: string) {
  const v = String(homeAway ?? "").toLowerCase();
  if (v === "home") return { text: "HOME", bg: UVA_BLUE, fg: "#fff" };
  if (v === "away") return { text: "AWAY", bg: UVA_ORANGE, fg: "#fff" };
  return { text: "NEUTRAL", bg: "#334155", fg: "#fff" };
}

export function uvaPageBg() {
  return `linear-gradient(160deg, ${UVA_BLUE}14 0%, ${UVA_ORANGE}10 55%, #f2f3f1 100%)`;
}
