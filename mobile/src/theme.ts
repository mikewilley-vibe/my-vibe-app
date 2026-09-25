export const colors = {
  harbor: "#3a6361",
  signal: "#c45c26",
  white: "#ffffff",
  slate950: "#020617",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  emerald950: "#022c22",
  emerald500: "#10b981",
  emerald400: "#34d399",
  emerald300: "#6ee7b7",
  rose950: "#4c0519",
  rose500: "#f43f5e",
  rose400: "#fb7185",
  rose300: "#fda4af",
  blue950: "#172554",
  blue500: "#3b82f6",
  blue400: "#60a5fa",
  amber100: "#fef3c7",
  amberBorder: "rgba(245, 158, 11, 0.4)",
  amberBg: "rgba(245, 158, 11, 0.1)",
  white10: "rgba(255, 255, 255, 0.1)",
} as const;

export const phaseBackground = {
  idle: colors.slate950,
  work: colors.emerald950,
  rest: colors.rose950,
  finished: colors.blue950,
} as const;

export const phasePill = {
  idle: colors.slate600,
  work: colors.emerald500,
  rest: colors.rose500,
  finished: colors.blue500,
} as const;

export const progressBar = {
  idle: colors.blue400,
  work: colors.emerald400,
  rest: colors.rose400,
  finished: colors.blue400,
} as const;
