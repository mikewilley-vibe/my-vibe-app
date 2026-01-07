import ShowTabs from "./ShowTabs";
import { myArtists } from "@/app/data/myArtists";

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Shows</h1>
        <p className="mt-2 text-sm text-slate-600">My Artists + Local Venues</p>

        <ShowTabs myArtists={myArtists} />
      </section>
    </main>
  );
}