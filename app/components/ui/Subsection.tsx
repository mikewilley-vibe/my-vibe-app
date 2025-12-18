import React from "react";

type SubsectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function Subsection({ title, children }: SubsectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}