// app/shows/page.tsx
import { getBaseUrl } from "@/lib/baseUrl";
import { safeFetch } from "@/lib/safeFetch";
import ShowTabs from "./ShowTabs";
import type { Concert } from "@/lib/concerts/types";

type ApiResp = { ok: boolean; updatedAt: string; events: Concert[] };

export default async function ShowsPage() {
  const baseUrl = await getBaseUrl();

  const [myArtistsRes, localRes] = await Promise.all([
    safeFetch<ApiResp>(`${baseUrl}/api/concerts/my-artists?radius=1000&days=180`, { cache: "no-store" }),
    safeFetch<ApiResp>(`${baseUrl}/api/concerts/local?radius=120&days=30`, { cache: "no-store" }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Shows</h1>
        <p className="mt-2 text-sm text-slate-600">
          My Artists (within 1,000 miles) + Local Venues (within 120 miles)
        </p>
export const dynamic = "force-dynamic";
        <div className="mt-6">
          <ShowTabs
            myArtists={myArtistsRes.data?.events ?? []}
            local={localRes.data?.events ?? []}
          />
        </div>
      </section>
    </main>
  );
}