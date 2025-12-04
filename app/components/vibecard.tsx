export default function VibeCard({
  title,
  emoji,
  message,
}: {
  title: string;
  emoji: string;
  message: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        {emoji} {title}
      </h3>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}
