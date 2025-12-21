import { NextResponse } from "next/server";
import { fetchTMEvents } from "@/lib/ticketmaster";
import { myArtists } from "@/app/data/myArtists";

function tmIso(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

export async function GET() {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 180);

  const results = await Promise.all(
    myArtists.map(async (artist) => {
      const events = await fetchTMEvents({
        keyword: artist.tmQuery ?? artist.name,
        latlong: "37.5407,-77.4360",
        radius: "1000",
        unit: "miles",
        sort: "date,asc",
        startDateTime: tmIso(start),
        endDateTime: tmIso(end),
        size: "6",
      });

      return {
        artist: artist.name,
        events,
      };
    })
  );

  const filtered = results.filter((r) => r.events.length > 0);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    results: filtered,
  });
}