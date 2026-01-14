import ShowTabs from "./ShowTabs";
import { myArtists } from "@/app/data/myArtists";
import FadeIn from "@/app/components/motion/FadeIn";

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <FadeIn>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Shows</h1>
            <p className="text-base text-slate-600">My favorite artists + venues across Hampton Roads, Richmond, and DC</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ShowTabs myArtists={myArtists} />
        </FadeIn>
      </section>
    </main>
  );
}