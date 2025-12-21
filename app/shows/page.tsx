import ShowTabs from "./ShowTabs";
import { getBaseUrl } from "@/lib/baseUrl";
import type { Concert } from "@/lib/concerts/types";

type FollowingGroup = { artist: string; events: Concert[] };

export default async function ShowsPage() {
  const baseUrl = await getBaseUrl();

  const [nextRes, followRes] = await Promise.all([
    fetch(`${baseUrl}/api/concerts/next-7-days`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/concerts/following`, { cache: "no-store" }),
  ]);

  const nextJson: { events: Concert[] } = await nextRes.json();
  const followJson: { results: FollowingGroup[] } = await followRes.json();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Shows
        </h1>

        <ShowTabs
          nextEvents={nextJson.events ?? []}
          following={followJson.results ?? []}
        />
      </section>
    </main>
  );
}