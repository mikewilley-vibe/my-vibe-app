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
    <header className="mb-10 sm:mb-12 relative">
      <div className="relative">
        {eyebrow ? <p className="label-xs mb-3">{eyebrow}</p> : null}

        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex-1 space-y-3">
            <h1 className="headline-lg">{title}</h1>
            <div className="accent-rule" />

            {description ? (
              <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-3xl leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>

          {rightSlot ? <div className="shrink-0 flex items-center">{rightSlot}</div> : null}
        </div>
      </div>
    </header>
  );
}
