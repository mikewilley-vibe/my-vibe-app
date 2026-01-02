type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  rightSlot,
}: Props) {
  return (
    <header className="mb-8">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500 truncate">
          {eyebrow}
        </p>
      ) : null}

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </header>
  );
}