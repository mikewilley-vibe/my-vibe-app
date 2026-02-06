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
    <header className="mb-16 relative">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-20 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />

      <div className="relative">
        {eyebrow ? (
          <p className="label-xs text-blue-600 uppercase tracking-wider mb-3">
            {eyebrow}
          </p>
        ) : null}

        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex-1 space-y-4">
            <h1 className="headline-lg text-slate-900">
              {title}
            </h1>

            {/* Signature accent line */}
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent rounded-full" />

            {description ? (
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed font-normal">
                {description}
              </p>
            ) : null}
          </div>

          {rightSlot ? (
            <div className="shrink-0 flex items-center">
              {rightSlot}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}