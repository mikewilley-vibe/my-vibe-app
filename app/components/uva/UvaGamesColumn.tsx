import UvaGameCard, { type UvaGame } from "@/app/components/uva/UvaGameCard";

type Props = {
  title: string;
  games: UvaGame[];
  emptyText: string;
  titleColor?: string;
};

export default function UvaGamesColumn({ title, games, emptyText, titleColor }: Props) {
  return (
    <div>
      <h2
        className="mb-3 text-sm font-semibold uppercase tracking-wide"
        style={titleColor ? { color: titleColor } : undefined}
      >
        {title}
      </h2>

      {games.length === 0 ? (
        <p className="text-sm text-slate-600">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <UvaGameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}