// app/shows/page.tsx
import { fetchJamBaseData } from "@/app/data/jambase";

type JamEvent = {
  id: string | number;
  name: string;
  date: string;
  venue: string;
  city: string;
  state?: string;
  url?: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const dynamic = "force-dynamic";

export default async function ShowsPage() {
  const data = await fetchJamBaseData();

  // 🔎 TEMP: helps you see what JamBase actually returns
  // (check your terminal logs)
  console.log("JamBase raw keys:", data.raw ? Object.keys(data.raw) : null);

  // Try common locations where events might live:
  const rawEvents =
    data.raw?.events ??
    data.raw?.Events ??
    data.raw?.data?.events ??
    data.raw?.results ??
    [];

  const events: JamEvent[] = (rawEvents ?? []).map((e: any) => ({
    id: e.id ?? e.event_id ?? e.Identifier ?? Math.random(),
    name: e.name ?? e.title ?? e.artist?.name ?? "Show",
    date: e.datetime ?? e.date ?? e.startDate ?? e.start_date,
    venue: e.venue?.name ?? e.venueName ?? "Unknown venue",
    city: e.venue?.city ?? e.city ?? "",
    state: e.venue?.state ?? e.state ?? "",
    url: e.url ?? e.ticketUrl ?? e.website,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Upcoming Shows
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Powered by JamBase • Last fetched{" "}
          {new Date(data.fetchedAt).toLocaleString()}
        </p>

        {events.length === 0 ? (
          <p className="text-sm text-slate-600">
            No shows found yet. (Next step: check the terminal log “JamBase raw keys”
            and adjust mapping to match the exact response.)
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((show) => (
              <a
                key={show.id}
                href={show.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-400 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {show.date ? formatDate(show.date) : "Date TBD"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {show.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {show.venue} — {show.city}
                      {show.state ? `, ${show.state}` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">
                    Tickets →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}