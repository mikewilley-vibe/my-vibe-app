// app/data/uvaSports.ts

export type UvaGame = {
  id: number;
  sport: "football" | "basketball";
  opponent: string;
  date: string;         // ISO date
  location: "home" | "away" | "neutral";
  result?: "win" | "loss" | "pending";
  score?: string;       // e.g. "31–24"
  note?: string;        // little vibe comment
};

export const uvaGames: UvaGame[] = [
  {
    id: 1,
    sport: "football",
    opponent: "Virginia Tech",
    date: "2025-11-29",
    location: "home",
    result: "pending",
    note: "Commonwealth Clash vibes incoming.",
  },
  {
    id: 2,
    sport: "basketball",
    opponent: "Duke",
    date: "2025-02-15",
    location: "home",
    result: "pending",
    note: "JPJ energy: high. Defense clinic loading.",
  },
  {
    id: 3,
    sport: "basketball",
    opponent: "UNC",
    date: "2025-01-20",
    location: "away",
    result: "win",
    score: "68–63",
    note: "Road win at the Dean Dome – vibes immaculate.",
  },
  {
    id: 4,
    sport: "football",
    opponent: "UNC",
    date: "2024-10-19",
    location: "away",
    result: "loss",
    score: "24–31",
    note: "Defense kept it close, but couldn’t finish drives.",
  },
];