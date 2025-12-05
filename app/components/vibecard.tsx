type VibeCardProps = {
  title: string;
  emoji: string;
  message: string;
};

export default function VibeCard({ title, emoji, message }: VibeCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-md border border-gray-100 px-6 py-5 flex flex-col gap-2 text-left hover:shadow-lg hover:-translate-y-0.5 transition">
      <div className="text-2xl">{emoji}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}