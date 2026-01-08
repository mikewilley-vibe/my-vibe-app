import Link from "next/link";

export type CalendarLink = {
  label: string;
  href: string;
  external?: boolean;
};

type Props = {
  title?: string;
  calendars: CalendarLink[];
};

export default function CalendarLinks({
  title = "Calendars",
  calendars,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {calendars.map((cal) => (
          <Link
            key={cal.href}
            href={cal.href}
            target={cal.external !== false ? "_blank" : undefined}
            rel={cal.external !== false ? "noreferrer" : undefined}
            className="
              rounded-full
              border border-slate-300
              bg-white
              px-4 py-2
              text-sm font-semibold text-slate-800
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-slate-400
              hover:bg-slate-50
            "
          >
            📅 {cal.label}
          </Link>
        ))}
      </div>
    </div>
  );
}