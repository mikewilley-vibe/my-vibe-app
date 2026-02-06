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
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `
      relative group
      bg-gradient-to-br from-blue-600 to-blue-700
      text-white font-semibold
      border border-blue-500/30
      shadow-lg shadow-blue-600/20
      hover:shadow-xl hover:shadow-blue-600/30
      hover:from-blue-500 hover:to-blue-600
      active:shadow-md active:shadow-blue-600/15
      transition-all duration-200 ease-out
    `,
    secondary: `
      relative group
      bg-white/80 backdrop-blur-md
      text-slate-900 font-semibold
      border border-white/40 hover:border-white/60
      shadow-sm hover:shadow-md
      hover:bg-white/95
      active:bg-white/70
      transition-all duration-200 ease-out
    `,
    tertiary: `
      relative
      text-slate-600 font-semibold
      hover:text-blue-600
      border-b-2 border-transparent hover:border-blue-600
      transition-all duration-200 ease-out
    `,
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-full
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const content = (
    <>
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </>
  );

  const className = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

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
