type StatusBadgeProps = {
  label: string;
  status?: "live" | "beta" | "synced" | "success" | "warning" | "offline";
  size?: "sm" | "md";
};

const statusConfig = {
  live: {
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
    text: "text-green-700",
  },
  beta: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
  },
  synced: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
    text: "text-purple-700",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
    text: "text-green-700",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  offline: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
    text: "text-slate-600",
  },
};

export default function StatusBadge({
  label,
  status = "live",
  size = "sm",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div
      className={`
        inline-flex items-center gap-2
        rounded-full border
        ${sizeClasses}
        ${config.bg} ${config.border} ${config.text}
        font-semibold
        shadow-xs
      `}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      {label}
    </div>
  );
}
