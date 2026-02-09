import ShowTabs from "./ShowTabs";
import { myArtists } from "@/app/data/myArtists";
import ArtistRotator from "@/app/components/concerts/ArtistRotator";
import FadeIn from "@/app/components/motion/FadeIn";
import ScrollReveal from "@/app/components/motion/ScrollReveal";
import InteractiveHover from "@/app/components/motion/InteractiveHover";
import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function ShowsPage() {
  const supabase = supabaseServer();

  // Fetch venues with unseen event counts
  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select("id, name, url, last_checked_at, active")
    .eq("active", true)
    .order("name");

  // Fetch unseen counts per venue
  const { data: unseenCounts, error: countsError } = await supabase
    .from("venue_events")
    .select("venue_id")
    .eq("seen", false);

  const unseenByVenue = new Map<string, number>();
  (unseenCounts ?? []).forEach((e: any) => {
    unseenByVenue.set(e.venue_id, (unseenByVenue.get(e.venue_id) ?? 0) + 1);
  });

  // Get total unseen count
  const totalUnseen = unseenCounts?.length ?? 0;

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
        <ScrollReveal direction="down">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Shows</h1>
              <p className="text-base text-slate-600">My favorite artists + venues across Hampton Roads, Richmond, and DC</p>
            </div>
            {totalUnseen > 0 && (
              <Link href="/shows/new" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors whitespace-nowrap">
                New{" "}
                <span className="rounded-full bg-blue-600 text-white px-2 py-0.5 text-xs font-bold">
                  {totalUnseen}
                </span>
              </Link>
            )}
          </div>
        </ScrollReveal>

        <FadeIn delay={0.1}>
          <div className="hidden md:block">
            <InteractiveHover scaleOnHover={1.01} shadowOnHover>
              <ArtistRotator artists={myArtists} visibleCount={3} intervalMs={6000} />
            </InteractiveHover>
          </div>
        </FadeIn>

        {/* Venue Status Section */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Monitored Venues</h2>
              <Link href="/shows/new" className="text-sm underline opacity-80 hover:opacity-100">
                View new shows
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {venues?.map((v: any) => (
                <div key={v.id} className="rounded-xl border border-slate-200 p-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                  <a href={v.url} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {v.name}
                  </a>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <div>
                      Last checked:{" "}
                      <span className="text-slate-900 font-medium">
                        {v.last_checked_at
                          ? new Date(v.last_checked_at).toLocaleString()
                          : "Never"}
                      </span>
                    </div>
                    <div>
                      Unseen:{" "}
                      <span className="text-slate-900 font-semibold">
                        {unseenByVenue.get(v.id) ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {venues && venues.length === 0 && (
              <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-600">
                No venues configured yet.
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <ShowTabs myArtists={myArtists} />
        </ScrollReveal>
      </section>
    </main>
  );
}