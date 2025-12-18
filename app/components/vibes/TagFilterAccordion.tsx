"use client";

type Props = {
  allTags: string[];
  selectedTag: string | "all";
  onSelect: (tag: string | "all") => void;
  countLabel?: number; // optional: show (#) next to selection
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
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        Filter by tag
      </div>

      <details className="group mt-2 rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {selectedTag === "all" ? "All tags" : `#${selectedTag}`}
              {typeof countLabel === "number" && (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  ({countLabel})
                </span>
              )}
            </div>

            <span className="select-none text-slate-400 transition-transform group-open:rotate-180">
              ▼
            </span>
          </div>
        </summary>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedTag === "all"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelect(tag)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
                selectedTag === tag
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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