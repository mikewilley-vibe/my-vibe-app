"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  label: string;
  href?: string;
  keywords?: string;
  action?: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const items: Item[] = useMemo(
    () => [
      { label: "Home", href: "/", keywords: "index start" },
      { label: "Projects", href: "/projects", keywords: "work experience" },
      { label: "Vibes (Vibe Log)", href: "/vibes", keywords: "blog log journal" },
      { label: "UVA", href: "/uva", keywords: "basketball schedule" },
      { label: "About", href: "/about", keywords: "bio" },
      { label: "Contact", href: "/contact", keywords: "email" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => {
      const hay = `${it.label} ${it.keywords ?? ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [items, q]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === "k";
      const isCmdK = (e.metaKey || e.ctrlKey) && isK;

      if (isCmdK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[active];
        if (!item) return;

        setOpen(false);
        setQ("");
        setActive(0);

        if (item.action) item.action();
        if (item.href) router.push(item.href);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, active, router]);

  // reset active when query changes
  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        aria-label="Close command palette"
        className="absolute inset-0 bg-black/30"
        onClick={() => setOpen(false)}
      />

      {/* modal */}
      <div className="absolute left-1/2 top-24 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 p-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to search… (Projects, Vibes, UVA)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <div className="mt-2 text-[11px] text-slate-500">
            Tip: ⌘K / Ctrl+K • ↑ ↓ to navigate • Enter to open • Esc to close
          </div>
        </div>

        <ul className="max-h-80 overflow-auto p-2">
          {filtered.length === 0 ? (
            <li className="p-3 text-sm text-slate-500">No matches.</li>
          ) : (
            filtered.map((it, idx) => (
              <li key={it.label}>
                <button
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                    setActive(0);
                    if (it.action) it.action();
                    if (it.href) router.push(it.href);
                  }}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm",
                    idx === active
                      ? "bg-blue-50 text-blue-900"
                      : "hover:bg-slate-50 text-slate-800",
                  ].join(" ")}
                >
                  <span>{it.label}</span>
                  {it.href ? (
                    <span className="text-xs text-slate-400">{it.href}</span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}