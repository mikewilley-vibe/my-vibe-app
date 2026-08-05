"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Timer, Volume2, VolumeX } from "lucide-react";

type Phase = "idle" | "work" | "rest" | "finished";
type Mode = "hiit" | "emom" | "thirty";

type TimerState = {
  phase: Phase;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  remainingSeconds: number;
  beepCount: number;
};

type Config = {
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

const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: "hiit", label: "HIIT" },
  { id: "emom", label: "EMOM" },
  { id: "thirty", label: "30 MIN" },
];

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const inputClassName =
  "w-full rounded-xl border border-slate-600/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-[color:var(--harbor)] focus:ring-2 focus:ring-[color:var(--harbor)]/40 disabled:cursor-not-allowed disabled:opacity-60";

export default function WorkoutTimerPage() {
  const baseId = useId();
  const audioRef = useRef<AudioContext | null>(null);

  const [config, setConfig] = useState<Config>({
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
  });

  const [timer, setTimer] = useState<TimerState>({
    phase: "idle",
    isRunning: false,
    isPaused: false,
    currentRound: 0,
    remainingSeconds: 0,
    beepCount: 0,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveMessage, setLiveMessage] = useState("Timer ready.");

  const isHiit = config.mode === "hiit";
  const isEmom = config.mode === "emom";
  const isThirty = config.mode === "thirty";
  const isIdle = timer.phase === "idle";
  const isFinished = timer.phase === "finished";
  const configLocked = timer.isRunning && !timer.isPaused;

  const totalRounds = useMemo(() => {
    if (isHiit) return config.rounds;
    if (isEmom) return config.emomMinutes;
    return config.thirtyMinutes;
  }, [isHiit, isEmom, config.rounds, config.emomMinutes, config.thirtyMinutes]);

  const emomRestSeconds = Math.max(
    (config.emomIntervalSeconds || 60) - (config.emomWorkSeconds || 0),
    0
  );

  const configError = useMemo(() => {
    if (isHiit) {
      if (config.workSeconds <= 0) return "Work seconds must be greater than 0.";
      if (config.rounds <= 0) return "Rounds must be at least 1.";
    }
    if (isEmom) {
      if (config.emomMinutes <= 0) return "Minutes must be at least 1.";
      if (config.emomWorkSeconds <= 0) return "Work per minute must be greater than 0.";
      if (config.emomWorkSeconds >= config.emomIntervalSeconds) {
        return "Work time must be shorter than the interval length.";
      }
      if (config.emomIntervalSeconds < 10) {
        return "Interval length must be at least 10 seconds.";
      }
    }
    if (isThirty && config.thirtyMinutes <= 0) return "Rounds must be at least 1.";
    return null;
  }, [isHiit, isEmom, isThirty, config]);

  const currentPhaseLabel =
    timer.phase === "work"
      ? "Work"
      : timer.phase === "rest"
        ? "Rest"
        : timer.phase === "finished"
          ? "Done"
          : "Ready";

  const maxSecondsForPhase = useMemo(() => {
    if (timer.phase === "work") {
      if (isHiit) return config.workSeconds || 1;
      if (isEmom) return config.emomWorkSeconds || 1;
      return config.thirtyWorkSeconds || 1;
    }
    if (timer.phase === "rest") {
      if (isHiit) return config.restSeconds || 1;
      if (isEmom) {
        const intervalSec =
          config.emomIntervalSeconds > 0 ? config.emomIntervalSeconds : 60;
        return Math.max(intervalSec - (config.emomWorkSeconds || 0), 1);
      }
      return config.thirtyRestSeconds || 1;
    }
    return 1;
  }, [
    timer.phase,
    isHiit,
    isEmom,
    config.workSeconds,
    config.restSeconds,
    config.emomWorkSeconds,
    config.emomIntervalSeconds,
    config.thirtyWorkSeconds,
    config.thirtyRestSeconds,
  ]);

  const progress =
    timer.phase === "work" || timer.phase === "rest"
      ? 1 - timer.remainingSeconds / maxSecondsForPhase
      : isFinished
        ? 1
        : 0;

  const statusMessage = useMemo(() => {
    if (timer.phase === "idle") return "Timer ready. Configure intervals, then start.";
    if (timer.phase === "finished") return "Workout complete. Nice work.";
    if (timer.isPaused) {
      return `Paused on ${currentPhaseLabel.toLowerCase()}, ${formatTime(
        timer.remainingSeconds
      )} remaining.`;
    }
    return `${currentPhaseLabel}. Round ${timer.currentRound} of ${totalRounds}. ${formatTime(
      timer.remainingSeconds
    )} remaining.`;
  }, [
    timer.phase,
    timer.isPaused,
    timer.remainingSeconds,
    timer.currentRound,
    currentPhaseLabel,
    totalRounds,
  ]);

  const phaseSurface =
    timer.phase === "work"
      ? "from-emerald-950 via-slate-950 to-slate-950"
      : timer.phase === "rest"
        ? "from-rose-950 via-slate-950 to-slate-950"
        : timer.phase === "finished"
          ? "from-blue-950 via-slate-950 to-slate-950"
          : "from-slate-950 via-slate-900 to-slate-950";

  const phasePill =
    timer.phase === "work"
      ? "bg-emerald-500"
      : timer.phase === "rest"
        ? "bg-rose-500"
        : timer.phase === "finished"
          ? "bg-blue-500"
          : "bg-slate-500";

  const progressColor =
    timer.phase === "work"
      ? "bg-emerald-400"
      : timer.phase === "rest"
        ? "bg-rose-400"
        : "bg-blue-400";

  const playBeep = async () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioRef.current) audioRef.current = new AudioCtx();
      if (audioRef.current.state === "suspended") await audioRef.current.resume();

      const ctx = audioRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.value = 0.08;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore beep failures
    }

    if (navigator.vibrate) navigator.vibrate(100);
  };

  useEffect(() => {
    if (timer.beepCount > 0 && soundEnabled) void playBeep();
  }, [timer.beepCount, soundEnabled]);

  useEffect(() => {
    if (
      timer.phase === "idle" ||
      timer.phase === "finished" ||
      timer.isPaused ||
      timer.remainingSeconds === maxSecondsForPhase
    ) {
      setLiveMessage(statusMessage);
    }
  }, [
    statusMessage,
    timer.phase,
    timer.isPaused,
    timer.remainingSeconds,
    maxSecondsForPhase,
  ]);

  useEffect(() => {
    if (
      !timer.isRunning ||
      timer.isPaused ||
      timer.phase === "idle" ||
      timer.phase === "finished"
    ) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (
          !prev.isRunning ||
          prev.isPaused ||
          prev.phase === "idle" ||
          prev.phase === "finished"
        ) {
          return prev;
        }

        if (prev.remainingSeconds > 1) {
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        }

        if (isHiit) {
          if (prev.phase === "work") {
            if (config.restSeconds > 0) {
              return {
                ...prev,
                phase: "rest",
                remainingSeconds: config.restSeconds,
                beepCount: prev.beepCount + 1,
              };
            }
            if (prev.currentRound < totalRounds) {
              return {
                ...prev,
                phase: "work",
                currentRound: prev.currentRound + 1,
                remainingSeconds: config.workSeconds,
                beepCount: prev.beepCount + 1,
              };
            }
            return {
              ...prev,
              phase: "finished",
              isRunning: false,
              remainingSeconds: 0,
              beepCount: prev.beepCount + 1,
            };
          }

          if (prev.currentRound < totalRounds) {
            return {
              ...prev,
              phase: "work",
              currentRound: prev.currentRound + 1,
              remainingSeconds: config.workSeconds,
              beepCount: prev.beepCount + 1,
            };
          }
          return {
            ...prev,
            phase: "finished",
            isRunning: false,
            remainingSeconds: 0,
            beepCount: prev.beepCount + 1,
          };
        }

        if (isEmom) {
          const workSec = config.emomWorkSeconds;
          const intervalSec =
            config.emomIntervalSeconds > 0 ? config.emomIntervalSeconds : 60;
          const restSec = Math.max(intervalSec - workSec, 0);

          if (prev.phase === "work") {
            if (restSec > 0) {
              return {
                ...prev,
                phase: "rest",
                remainingSeconds: restSec,
                beepCount: prev.beepCount + 1,
              };
            }
            if (prev.currentRound < totalRounds) {
              return {
                ...prev,
                phase: "work",
                currentRound: prev.currentRound + 1,
                remainingSeconds: workSec,
                beepCount: prev.beepCount + 1,
              };
            }
            return {
              ...prev,
              phase: "finished",
              isRunning: false,
              remainingSeconds: 0,
              beepCount: prev.beepCount + 1,
            };
          }

          if (prev.currentRound < totalRounds) {
            return {
              ...prev,
              phase: "work",
              currentRound: prev.currentRound + 1,
              remainingSeconds: workSec,
              beepCount: prev.beepCount + 1,
            };
          }
          return {
            ...prev,
            phase: "finished",
            isRunning: false,
            remainingSeconds: 0,
            beepCount: prev.beepCount + 1,
          };
        }

        const workSec = config.thirtyWorkSeconds;
        const restSec = config.thirtyRestSeconds;

        if (prev.phase === "work") {
          return {
            ...prev,
            phase: "rest",
            remainingSeconds: restSec,
            beepCount: prev.beepCount + 1,
          };
        }

        if (prev.currentRound < totalRounds) {
          return {
            ...prev,
            phase: "work",
            currentRound: prev.currentRound + 1,
            remainingSeconds: workSec,
            beepCount: prev.beepCount + 1,
          };
        }

        return {
          ...prev,
          phase: "finished",
          isRunning: false,
          remainingSeconds: 0,
          beepCount: prev.beepCount + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    timer.isRunning,
    timer.isPaused,
    timer.phase,
    isHiit,
    isEmom,
    config.workSeconds,
    config.restSeconds,
    config.emomWorkSeconds,
    config.emomIntervalSeconds,
    config.thirtyWorkSeconds,
    config.thirtyRestSeconds,
    totalRounds,
  ]);

  const resetTimer = () => {
    setTimer({
      phase: "idle",
      isRunning: false,
      isPaused: false,
      currentRound: 0,
      remainingSeconds: 0,
      beepCount: 0,
    });
    setLiveMessage("Timer reset.");
  };

  const startTimer = () => {
    if (configError) {
      setLiveMessage(configError);
      return;
    }

    if (isHiit) {
      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.workSeconds,
        beepCount: 1,
      });
      return;
    }

    if (isEmom) {
      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.emomWorkSeconds,
        beepCount: 1,
      });
      return;
    }

    setTimer({
      phase: "work",
      isRunning: true,
      isPaused: false,
      currentRound: 1,
      remainingSeconds: config.thirtyWorkSeconds,
      beepCount: 1,
    });
  };

  const pauseOrResume = () => {
    if (!timer.isRunning) return;
    setTimer((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleModeChange = (mode: Mode) => {
    setConfig((prev) => ({ ...prev, mode }));
    resetTimer();
  };

  const handleConfigChange = (field: keyof Config, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const title = isHiit
    ? "HIIT Workout Timer"
    : isEmom
      ? "EMOM Workout Timer"
      : "30 MIN Workout Timer";

  const subtitle = isHiit
    ? "Set work and rest intervals, then start and go."
    : isEmom
      ? "Every minute on the minute. Work, then rest until the next minute."
      : "Work 60 seconds, rest 30 seconds, and repeat for your chosen rounds.";

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${phaseSurface} text-slate-100 transition-colors duration-500`}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:items-stretch md:gap-8 md:py-12">
        <div className="w-full md:w-2/5">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--harbor)] text-white shadow-lg shadow-black/30">
                  <Timer className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--signal)]">
                    Training tool
                  </p>
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {title}
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--harbor)]"
                aria-pressed={soundEnabled}
                aria-label={soundEnabled ? "Mute beeps" : "Enable beeps"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {soundEnabled ? "Sound on" : "Muted"}
              </button>
            </div>

            <p className="mb-5 text-sm text-slate-300">{subtitle}</p>

            <div
              role="radiogroup"
              aria-label="Timer mode"
              className="mb-5 inline-flex rounded-full bg-slate-950/70 p-1 ring-1 ring-slate-700"
            >
              {MODE_OPTIONS.map((option) => {
                const selected = config.mode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleModeChange(option.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                      selected
                        ? "bg-white text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {isHiit ? (
              <div className="grid gap-4">
                <div>
                  <label
                    htmlFor={`${baseId}-work`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Work (seconds)
                  </label>
                  <input
                    id={`${baseId}-work`}
                    type="number"
                    min={1}
                    disabled={configLocked}
                    value={config.workSeconds}
                    onChange={(e) =>
                      handleConfigChange("workSeconds", Number(e.target.value))
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-rest`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Rest (seconds)
                  </label>
                  <input
                    id={`${baseId}-rest`}
                    type="number"
                    min={0}
                    disabled={configLocked}
                    value={config.restSeconds}
                    onChange={(e) =>
                      handleConfigChange("restSeconds", Number(e.target.value))
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-rounds`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Rounds
                  </label>
                  <input
                    id={`${baseId}-rounds`}
                    type="number"
                    min={1}
                    disabled={configLocked}
                    value={config.rounds}
                    onChange={(e) =>
                      handleConfigChange("rounds", Number(e.target.value))
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            ) : isEmom ? (
              <div className="grid gap-4">
                <div>
                  <label
                    htmlFor={`${baseId}-emom-minutes`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Minutes (rounds)
                  </label>
                  <input
                    id={`${baseId}-emom-minutes`}
                    type="number"
                    min={1}
                    disabled={configLocked}
                    value={config.emomMinutes}
                    onChange={(e) =>
                      handleConfigChange("emomMinutes", Number(e.target.value))
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-emom-work`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Work per minute (seconds)
                  </label>
                  <input
                    id={`${baseId}-emom-work`}
                    type="number"
                    min={1}
                    max={config.emomIntervalSeconds}
                    disabled={configLocked}
                    value={config.emomWorkSeconds}
                    onChange={(e) =>
                      handleConfigChange(
                        "emomWorkSeconds",
                        Number(e.target.value)
                      )
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-emom-interval`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Interval length (seconds)
                  </label>
                  <input
                    id={`${baseId}-emom-interval`}
                    type="number"
                    min={10}
                    disabled={configLocked}
                    value={config.emomIntervalSeconds}
                    onChange={(e) =>
                      handleConfigChange(
                        "emomIntervalSeconds",
                        Number(e.target.value)
                      )
                    }
                    className={inputClassName}
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Rest each minute:{" "}
                    <span className="font-semibold text-slate-200">
                      {emomRestSeconds}s
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">30 MIN plan</p>
                  <p className="mt-2">
                    Work{" "}
                    <span className="font-semibold text-emerald-300">60s</span>,
                    rest{" "}
                    <span className="font-semibold text-rose-300">30s</span>,
                    repeat for{" "}
                    <span className="font-semibold text-white">
                      {config.thirtyMinutes}
                    </span>{" "}
                    rounds.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-thirty-rounds`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Rounds
                  </label>
                  <input
                    id={`${baseId}-thirty-rounds`}
                    type="number"
                    min={1}
                    disabled={configLocked}
                    value={config.thirtyMinutes}
                    onChange={(e) =>
                      handleConfigChange(
                        "thirtyMinutes",
                        Number(e.target.value)
                      )
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            )}

            {configError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100"
              >
                {configError}
              </p>
            )}

            <p className="mt-5 text-xs text-slate-500">
              Prefer the full site?{" "}
              <Link href="/" className="font-medium text-[color:var(--signal)] hover:brightness-110">
                Back home
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5">
          <div className="flex h-full min-h-[420px] flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700">
                  {timer.currentRound > 0
                    ? `Round ${timer.currentRound} of ${totalRounds}`
                    : "Ready to go"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${phasePill}`}
                >
                  {currentPhaseLabel}
                  {timer.isPaused ? " · Paused" : ""}
                </span>
              </div>

              <div
                className="mb-8"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(
                  Math.min(Math.max(progress * 100, 0), 100)
                )}
                aria-label="Phase progress"
              >
                <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-slate-700">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-200 ${progressColor}`}
                    style={{
                      width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-slate-400">
                  {timer.phase === "idle" && "Press start to begin"}
                  {timer.phase === "work" && "Go hard"}
                  {timer.phase === "rest" && "Breathe"}
                  {timer.phase === "finished" && "Nice work"}
                </p>
                <p
                  className="text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl md:text-8xl"
                  aria-hidden={timer.phase === "idle"}
                >
                  {isIdle ? "00:00" : formatTime(timer.remainingSeconds)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startTimer}
                disabled={(timer.isRunning && !timer.isPaused) || !!configError}
                className="min-w-[112px] rounded-full bg-[var(--harbor)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--harbor)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFinished ? "Restart" : "Start"}
              </button>
              <button
                type="button"
                onClick={pauseOrResume}
                disabled={!timer.isRunning}
                className="min-w-[112px] rounded-full border border-slate-600 bg-slate-950/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--harbor)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timer.isPaused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="min-w-[112px] rounded-full border border-transparent px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-rose-400/50 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
