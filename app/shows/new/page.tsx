import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function NewShowsPage() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("venue_events")
    .select("id, title, event_date, event_url, first_seen_at, venues(name)")
    .eq("seen", false)
    .order("first_seen_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">New Shows</h1>
        <p className="mt-4 text-sm opacity-80">{error.message}</p>
      </div>
    );
  }

  const items = data ?? [];

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">New Shows</h1>
        <Link className="text-sm underline opacity-80 hover:opacity-100" href="/shows">
          Back to Shows
        </Link>
      </div>

      <p className="mt-2 text-sm opacity-80">
        {items.length} unseen event{items.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 space-y-3">
        {items.map((e: any) => (
          <div key={e.id} className="rounded-2xl border p-4 shadow-sm">
            <div className="text-xs opacity-70">{e.venues?.name}</div>
            <div className="mt-1 font-medium">{e.title}</div>
            <div className="mt-1 text-sm opacity-80">
              {e.event_date ? e.event_date : "Date unknown"}
            </div>

            <div className="mt-3 flex items-center gap-3">
              {e.event_url ? (
                <a className="text-sm underline" href={e.event_url} target="_blank" rel="noreferrer">
                  Open event
                </a>
              ) : null}

              <form action={`/shows/new/mark-seen`} method="post">
                <input type="hidden" name="id" value={e.id} />
                <button className="text-sm underline opacity-80 hover:opacity-100" type="submit">
                  Mark as seen
                </button>
              </form>
            </div>
          </div>
        ))}

        {items.length === 0 ? (
          <div className="rounded-2xl border p-6 text-sm opacity-80">
            No new events right now.
          </div>
        ) : null}
      </div>
    </div>
  );
}
