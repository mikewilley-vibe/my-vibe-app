type InfoCardProps = {
  icon?: React.ReactNode;
  eyebrow?: string;     // small top line (e.g., "BASKETBALL • AWAY")
  title: string;        // main line
  subtitle?: string;    // smaller line (date)
  meta?: React.ReactNode; // optional right-side slot (score, badge, etc.)
  children?: React.ReactNode; // extra lines (links, notes)
};

export default function InfoCard({
  icon,
  eyebrow,
  title,
  subtitle,
  meta,
  children,
}: InfoCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border bg-white border-slate-200">
      <div className="flex items-center gap-4">
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold bg-slate-900 text-white">
            {icon}
          </div>
        ) : null}

        <div>
          {eyebrow ? (
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
              {eyebrow}
            </div>
          ) : null}

          <div className="mt-1 text-sm font-semibold text-slate-900">{title}</div>

          {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}

          {children ? <div className="mt-1">{children}</div> : null}
        </div>
      </div>

      {meta ? <div className="ml-4 flex flex-col items-end gap-2">{meta}</div> : null}
    </div>
  );
}