import React from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ eyebrow, title, children, className }: SectionProps) {
  return (
    <section className={`space-y-6 ${className ?? ""}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>

      {children}
    </section>
  );
}