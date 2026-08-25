export type Phase = "idle" | "work" | "rest" | "finished";
export type Mode = "hiit" | "emom" | "thirty";

export type TimerState = {
  phase: Phase;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  remainingSeconds: number;
  beepCount: number;
};

export type Config = {
  mode: Mode;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  emomMinutes: number;
  emomWorkSeconds: number;
  emomIntervalSeconds: number;
  thirtyMinutes: number;
  thirtyWorkSeconds: number;
  thirtyRestSeconds: number;
};

export const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: "hiit", label: "HIIT" },
  { id: "emom", label: "EMOM" },
  { id: "thirty", label: "30 MIN" },
];

export const DEFAULT_CONFIG: Config = {
  mode: "hiit",
  workSeconds: 20,
  restSeconds: 10,
  rounds: 8,
  emomMinutes: 10,
  emomWorkSeconds: 40,
  emomIntervalSeconds: 60,
  thirtyMinutes: 20,
  thirtyWorkSeconds: 60,
  thirtyRestSeconds: 30,
};

export const IDLE_TIMER: TimerState = {
  phase: "idle",
  isRunning: false,
  isPaused: false,
  currentRound: 0,
  remainingSeconds: 0,
  beepCount: 0,
};
