type VibeCardProps = {
  title: string;
  emoji: string;
  message: string;
};

export default function VibeCard({ title, emoji, message }: VibeCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {message}
      </p>
    </article>
  );
}