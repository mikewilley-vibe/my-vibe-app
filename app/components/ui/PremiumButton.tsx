import Link from "next/link";

type PremiumButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  isExternal?: boolean;
  icon?: React.ReactNode;
};

export default function PremiumButton({
  href,
  label,
  variant = "primary",
  size = "md",
  isExternal = false,
  icon,
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantClasses = {
    primary: `
      bg-[var(--harbor)] text-white font-semibold
      hover:brightness-110 shadow-sm
      transition-all duration-200 ease-out
    `,
    secondary: `
      bg-white/90 text-[var(--ink)] font-semibold
      border border-[var(--fog)] hover:border-[var(--harbor)]/35
      shadow-sm hover:shadow-md
      transition-all duration-200 ease-out
    `,
    tertiary: `
      text-[var(--ink-muted)] font-semibold
      hover:text-[var(--harbor)]
      border-b border-transparent hover:border-[var(--harbor)]
      rounded-none
      transition-all duration-200 ease-out
    `,
  };

  const rounded = variant === "tertiary" ? "" : "rounded-xl";

  const className = `
    inline-flex items-center justify-center gap-2
    ${rounded}
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--harbor)]/40
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]} ${variantClasses[variant]}
  `;

  const content = (
    <>
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
