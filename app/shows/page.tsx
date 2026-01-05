// app/shows/page.tsx
export const dynamic = "force-dynamic";

import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import ShowTabs from "./ShowTabs";
import type { Concert } from "@/lib/concerts/types";

type ApiResp = { ok: boolean; updatedAt: string; events: Concert[] };

export default async function ShowsPage() {
  
  const baseUrl = await getBaseUrl();

  const [myArtistsRes, localRes] = await Promise.all([
    safeFetch<ApiResp>(`${baseUrl}/api/concerts/my-artists?radius=1000&days=180`, {
      cache: "no-store",
    }),
    safeFetch<ApiResp>(`${baseUrl}/api/concerts/local?radius=120&days=30`, {
      cache: "no-store",
    }),
  ]);
console.log("[shows] baseUrl:", baseUrl);

console.log("[shows] myArtistsRes:", {
  ok: myArtistsRes.ok,
  status: (myArtistsRes as any).status,
  error: (myArtistsRes as any).error,
  hasData: !!myArtistsRes.data,
  count: myArtistsRes.data?.events?.length ?? 0,
});

console.log("[shows] localRes:", {
  ok: localRes.ok,
  status: (localRes as any).status,
  error: (localRes as any).error,
  hasData: !!localRes.data,
  count: localRes.data?.events?.length ?? 0,
  
});
  const artistsFailed = !myArtistsRes.ok;
  const localFailed = !localRes.ok;

  const myArtists = artistsFailed ? [] : (myArtistsRes.data?.events ?? []);
  const local = localFailed ? [] : (localRes.data?.events ?? []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Shows</h1>
        <p className="mt-2 text-sm text-slate-600">
          My Artists (within 1,000 miles) + Local Venues (within 120 miles)
        </p>

        <div className="mt-6">
          {(artistsFailed || localFailed) && (
  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    Ticketmaster is temporarily unavailable for{" "}
    {artistsFailed && localFailed
      ? "My Artists and Local Venues"
      : artistsFailed
      ? "My Artists"
      : "Local Venues"}
    . Try again in a minute.
  </div>
)}
         <ShowTabs myArtists={myArtists} local={local} />
        </div>
      </section>
    </main>
  );
}