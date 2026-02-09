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
          <div className="flex items-baseline justify-between gap-4 mb-6">
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

        {/* Monitored Venues Banner - Compact */}
        {venues && venues.length > 0 && (
          <FadeIn delay={0.08}>
            <div className="mb-8 rounded-lg border border-slate-200 bg-white/40 backdrop-blur-sm p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 overflow-x-auto pb-1">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">Venues:</span>
                  <div className="flex gap-2 flex-1 overflow-x-auto">
                    {venues.map((v: any) => (
                      <a
                        key={v.id}
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-medium text-slate-700 whitespace-nowrap"
                      >
                        {v.name}
                        {unseenByVenue.get(v.id) ? (
                          <span className="ml-1 rounded-full bg-blue-500 text-white px-1.5 text-xs font-bold">
                            {unseenByVenue.get(v.id)}
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                </div>
                <Link href="/shows/new" className="text-xs underline opacity-70 hover:opacity-100 whitespace-nowrap">
                  View all
                </Link>
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.1}>
          <div className="hidden md:block">
            <InteractiveHover scaleOnHover={1.01} shadowOnHover>
              <ArtistRotator artists={myArtists} visibleCount={3} intervalMs={6000} />
            </InteractiveHover>
          </div>
        </FadeIn>

        {/* Local Shows - Main Content */}
        <ScrollReveal direction="up" delay={0.15}>
          <ShowTabs myArtists={myArtists} />
        </ScrollReveal>
      </section>
    </main>
  );
}