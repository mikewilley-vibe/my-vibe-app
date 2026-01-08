type Chip = {
  label: string;
  className: string;
};

const chips: Chip[] = [
  {
    label: "Project Management",
    className:
      "rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white",
  },
  {
    label: "Public-Sector web projects",
    className:
      "rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700",
  },

  {
    label: "Finance & Analytics",
    className:
      "rounded-full bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700",
  },
];

export default function IntroSection() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        About Mike
      </h1>

      <p className="text-lg text-slate-700">
        I&apos;m an accountant and a project manager for a large tech firm that
        focuses on the public-sector. During the day I&apos;m helping partners witht their websites
        and payments while balancing budgets. At night I&apos;m learning to code
        and building my own tools.
      </p>

      <p className="text-slate-700">
        This little HQ is where I&apos;m documenting the journey from
        &quot;power user&quot; to developer — one vibe at a time.
      </p>

      <div className="flex flex-wrap gap-3">
        {chips.map((chip) => (
          <span key={chip.label} className={chip.className}>
            {chip.label}
          </span>
        ))}
      </div>
    </section>
  );
}