type SectionDividerProps = {
  variant?: "gradient" | "diagonal" | "fade" | "none";
  className?: string;
};

export default function SectionDivider({
  variant = "gradient",
  className = "",
}: SectionDividerProps) {
  if (variant === "gradient") {
    return (
      <div className={`h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent ${className}`} />
    );
  }

  if (variant === "diagonal") {
    return (
      <div className={`relative h-12 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,40 Q300,0 600,40 T1200,40 L1200,0 L0,0 Z"
            fill="rgba(255, 255, 255, 0.3)"
          />
        </svg>
      </div>
    );
  }

  if (variant === "fade") {
    return (
      <div
        className={`h-24 bg-gradient-to-b from-white via-white/50 to-transparent ${className}`}
      />
    );
  }

  return null;
}
