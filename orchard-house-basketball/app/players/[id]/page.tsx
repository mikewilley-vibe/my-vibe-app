import Link from "next/link";
import { notFound } from "next/navigation";
import { PLAYERS, getPlayerById } from "@/app/data/players";

export const dynamic = "force-static";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ id: String(p.id) }));
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const playerId = Number(id);
  const player = Number.isFinite(playerId) ? getPlayerById(playerId) : undefined;

  if (!player) return notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to roster
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-300 to-indigo-700 text-white font-semibold shadow-sm">
              #{player.number}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{player.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                Grade {player.grade}
                {player.position ? ` · ${player.position}` : ""}
              </p>
            </div>
          </div>

          {player.bio ? (
            <p className="mt-4 whitespace-pre-line text-sm text-slate-600">
              {player.bio}
            </p>
          ) : null}
        </div>
        {player.stats ? (
  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
    <h2 className="mb-4 text-lg font-semibold text-slate-900">
      Season Stats
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {[
        { label: "PTS", value: player.stats.points },
        { label: "REB", value: player.stats.rebounds },
        { label: "AST", value: player.stats.assists },
        { label: "STL", value: player.stats.steals },
        { label: "FLS", value: player.stats.fouls },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-200/70"
        >
          <p className="text-xs font-semibold text-slate-500">
            {stat.label}
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
    <p className="text-sm text-slate-500">
      Stats will appear as games are played.
    </p>
  </div>
)}
      </section>
    </main>
  );
}