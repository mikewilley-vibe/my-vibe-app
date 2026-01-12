import Link from "next/link";
import { notFound } from "next/navigation";

import { PLAYERS, getPlayerById } from "@/app/data/players";

export const dynamic = "force-static";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ id: String(p.id) }));
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const player = Number.isFinite(id) ? getPlayerById(id) : undefined;

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
            <div
              className="
                flex size-16 items-center justify-center
                rounded-full bg-gradient-to-br from-purple-300 to-indigo-700
                text-white font-semibold shadow-sm
              "
            >
              #{player.number}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {player.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Grade {player.grade}
                {player.position ? ` · ${player.position}` : ""}
              </p>
            </div>
          </div>

          {player.bio && (
            <p className="mt-4 text-sm text-slate-600 whitespace-pre-line">
              {player.bio}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}