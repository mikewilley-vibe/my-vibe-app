// app/data/jambase.ts

export type JamBaseResult = {
  fetchedAt: string;
  raw: any | null;
};

function yyyymmdd(d: Date) {
  // JamBase commonly accepts YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

export async function fetchJamBaseData(): Promise<JamBaseResult> {
  const apiKey = process.env.JAMBASE_API_KEY;

  if (!apiKey) {
    console.error("Missing JAMBASE_API_KEY in environment");
    return { fetchedAt: new Date().toISOString(), raw: null };
  }

  // Example query: shows near Richmond, VA in the next 30 days
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 30);

  const params = new URLSearchParams({
    apikey: apiKey,
    zipCode: "23219",        // change if you want
    radius: "50",            // miles
    startDate: yyyymmdd(start),
    endDate: yyyymmdd(end),
    perPage: "50",
    page: "1",
  });

  // ✅ This is the JamBase JSON API base shown in their docs UI (not /concerts/finder)
  const url = `https://www.jambase.com/jb-api/v1/events?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  // Helpful debugging if the response is HTML (your current problem)
  if (!res.ok) {
    console.error("JamBase HTTP error:", res.status, res.statusText);
    console.error("First 300 chars:\n", text.slice(0, 300));
    return { fetchedAt: new Date().toISOString(), raw: null };
  }

  if (!contentType.includes("application/json")) {
    console.error("JamBase fetch error: response was not JSON.");
    console.error("content-type:", contentType);
    console.error("First 300 chars:\n", text.slice(0, 300));
    return { fetchedAt: new Date().toISOString(), raw: null };
  }

  let raw: any = null;
  try {
    raw = JSON.parse(text);
  } catch {
    console.error("JamBase fetch error: JSON parse failed.");
    console.error("First 300 chars:\n", text.slice(0, 300));
  }

  return {
    fetchedAt: new Date().toISOString(),
    raw,
  };
}