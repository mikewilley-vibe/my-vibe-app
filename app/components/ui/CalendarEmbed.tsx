// app/components/ui/CalendarEmbed.tsx
import React from "react";

type CalendarView = "AGENDA" | "MONTH" | "WEEK";

type CalendarEmbedProps = {
  /** Google Calendar embed URL (iframe src) */
  src: string;

  title?: string;
  description?: string;

  /** iframe height in px */
  height?: number;

  /** Clean / minimal Google chrome */
  clean?: boolean;

  /** Agenda is the cleanest */
  view?: CalendarView;

  /** IANA timezone, ex: America/New_York */
  timezone?: string;

  className?: string;
  
};
type CalendarCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type Props = {
  title?: string;
  subtitle?: string;
  embedSrc: string; // your google calendar embed link
  ctas?: CalendarCta[]; // 👈 new
};


function isSafeGoogleCalendarUrl(src: string) {
  try {
    const u = new URL(src);
    const okHost = u.hostname === "calendar.google.com" || u.hostname.endsWith(".google.com");
    const okPath = u.pathname.includes("/calendar/embed");
    return okHost && okPath;
  } catch {
    return false;
  }
}

function withCalendarParams(
  src: string,
  opts: { clean: boolean; view: CalendarView; timezone: string }
) {
  const u = new URL(src);

  // Force “embed” path if user pasted a variant (usually already correct)
  // u.pathname = "/calendar/embed"; // optional — only if you want to hard-force

  // Defaults that make it feel less “Google-y”
  u.searchParams.set("mode", opts.view);
  u.searchParams.set("ctz", opts.timezone);

  if (opts.clean) {
    u.searchParams.set("showTitle", "0");
    u.searchParams.set("showTabs", "0");
    u.searchParams.set("showCalendars", "0");
    u.searchParams.set("showPrint", "0");
    u.searchParams.set("showTz", "0");
    // Keeps it visually quiet (light background)
    // If you like, set a subtle background:
    // u.searchParams.set("bgcolor", "%23ffffff");
  }

  return u.toString();
}

export default function CalendarEmbed({
  src,
  title = "My Calendar",
  description = "Public events I’ve shared",
  height = 640,
  clean = true,
  view = "AGENDA",
  timezone = "America/New_York",
  className = "",
  showHeader = true,
}: CalendarEmbedProps & { showHeader?: boolean }) {
  const safe = isSafeGoogleCalendarUrl(src);

  if (!safe) {
    return (
      <div className={`rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`}>
        Calendar embed URL doesn’t look like a Google Calendar embed link.
      </div>
    );
  }

  const finalSrc = withCalendarParams(src, { clean, view, timezone });

  return (
    <section className={`space-y-3 ${className}`}>
      {showHeader ? (
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-[var(--ink-muted)]">
              {description}
            </p>
          )}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[var(--fog)] bg-white shadow-sm">
        <iframe
          title={title}
          src={finalSrc}
          style={{ border: 0 }}
          width="100%"
          height={height}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}