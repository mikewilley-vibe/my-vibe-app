import ShowTabs from "./ShowTabs";
import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import type { Concert } from "@/lib/concerts/types";

type FollowingGroup = { artist: string; events: Concert[] };

export default async function ShowsPage() {
  const baseUrl = await getBaseUrl();

  const [next, follow] = await Promise.all([
    safeFetch<{ events: Concert[] }>(`${baseUrl}/api/concerts/next-7-days`, { cache: "no-store" }),
    safeFetch<{ results: FollowingGroup[] }>(`${baseUrl}/api/concerts/following`, { cache: "no-store" }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shows</h1>

        <ShowTabs
          nextEvents={next.data?.events ?? []}
          following={follow.data?.results ?? []}
        />
      </section>
    </main>
  );
}