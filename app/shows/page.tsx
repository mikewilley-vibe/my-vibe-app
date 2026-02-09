import ShowTabs from "./ShowTabs";
import { myArtists } from "@/app/data/myArtists";
import ArtistRotator from "@/app/components/concerts/ArtistRotator";
import FadeIn from "@/app/components/motion/FadeIn";
import Image from "next/image";

export default function ShowsPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Sticky hero image behind content */}
      <div className="fixed inset-0 z-0 w-full h-96 md:h-[420px] flex justify-center pointer-events-none select-none">
        <Image
          src="/images/shows-hero.png"
          alt="Shows Hero"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          className="opacity-60 blur-sm md:blur-0"
          priority
        />
      </div>
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-10">
        <FadeIn>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Shows</h1>
            <p className="text-base text-slate-600">My favorite artists + venues across Hampton Roads, Richmond, and DC</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="hidden md:block">
            <ArtistRotator artists={myArtists} visibleCount={3} intervalMs={6000} />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ShowTabs myArtists={myArtists} />
        </FadeIn>
      </section>
    </main>
  );
}