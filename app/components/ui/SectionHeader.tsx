type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <p className="label-xs mb-2">{eyebrow}</p>
      <h2 className="headline-md">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-[var(--ink-muted)] leading-relaxed">{description}</p>
      ) : null}
      <div className="accent-rule" />
    </div>
  );
}
