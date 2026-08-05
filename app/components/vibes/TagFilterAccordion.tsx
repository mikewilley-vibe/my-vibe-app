"use client";

type Props = {
  allTags: string[];
  selectedTag: string | "all";
  onSelect: (tag: string | "all") => void;
  countLabel?: number;
  className?: string;
};

export default function TagFilterAccordion({
  allTags,
  selectedTag,
  onSelect,
  countLabel,
  className,
}: Props) {
  return (
    <div className={className ?? ""}>
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--harbor)]">
        Filter by tag
      </div>

      <details className="group mt-2 rounded-2xl border border-[var(--fog)] bg-white/80 p-3 shadow-sm">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-[var(--ink)]">
              {selectedTag === "all" ? "All tags" : `#${selectedTag}`}
              {typeof countLabel === "number" && (
                <span className="ml-2 text-xs text-[var(--ink-muted)]">({countLabel})</span>
              )}
            </div>

            <span className="select-none text-[var(--ink-muted)] transition-transform group-open:rotate-180">
              ▾
            </span>
          </div>
        </summary>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition ${
              selectedTag === "all"
                ? "border-[var(--harbor)] bg-[var(--harbor)] text-white"
                : "border-[var(--fog)] bg-white text-[var(--ink-muted)] hover:border-[var(--harbor)]/35"
            }`}
          >
            All
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelect(tag)}
              className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition ${
                selectedTag === tag
                  ? "border-[var(--harbor)] bg-[var(--harbor)] text-white"
                  : "border-[var(--fog)] bg-white text-[var(--ink-muted)] hover:border-[var(--harbor)]/35"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
