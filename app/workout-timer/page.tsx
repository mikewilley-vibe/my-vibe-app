"use client";

import { useEffect, useState } from "react";

type Phase = "idle" | "work" | "rest" | "finished";
type Mode = "hiit" | "emom";

type TimerState = {
  phase: Phase;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  remainingSeconds: number;
};

type Config = {
  mode: Mode;

  // HIIT config
  workSeconds: number;
  restSeconds: number;
  rounds: number;

  // EMOM config
  emomMinutes: number; // number of minutes / rounds
  emomWorkSeconds: number; // work duration inside each minute
  emomIntervalSeconds: number; // usually 60
};

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function WorkoutTimerPage() {
  const [config, setConfig] = useState<Config>({
    mode: "hiit",
    workSeconds: 20,
    restSeconds: 10,
    rounds: 8,
    emomMinutes: 10,
    emomWorkSeconds: 40,
    emomIntervalSeconds: 60,
  });

  const [timer, setTimer] = useState<TimerState>({
    phase: "idle",
    isRunning: false,
    isPaused: false,
    currentRound: 0,
    remainingSeconds: 0,
  });

  // Derived helpers
  const isHiit = config.mode === "hiit";
  const isEmom = config.mode === "emom";

  const totalRounds = isHiit ? config.rounds : config.emomMinutes;

  const isIdle = timer.phase === "idle";
  const isFinished = timer.phase === "finished";

  const currentPhaseLabel =
    timer.phase === "work"
      ? "Work"
      : timer.phase === "rest"
      ? "Rest"
      : timer.phase === "finished"
      ? "Done!"
      : "Ready";

  const maxSecondsForPhase =
    timer.phase === "work"
      ? isHiit
        ? config.workSeconds || 1
        : config.emomWorkSeconds || 1
      : timer.phase === "rest"
      ? isHiit
        ? config.restSeconds || 1
        : Math.max(
            (config.emomIntervalSeconds || 60) -
              (config.emomWorkSeconds || 0),
            1
          )
      : 1;

  const progress =
    timer.phase === "work" || timer.phase === "rest"
      ? 1 - timer.remainingSeconds / maxSecondsForPhase
      : 0;

  // Core timer logic
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
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        }

        // remainingSeconds is 1 → hitting 0 now, advance phase
        if (isHiit) {
          // HIIT MODE
          if (prev.phase === "work") {
            if (config.restSeconds > 0) {
              // go to rest
              return {
                ...prev,
                phase: "rest",
                remainingSeconds: config.restSeconds,
              };
            } else {
              // no rest, next round or finish
              if (prev.currentRound < totalRounds) {
                return {
                  ...prev,
                  phase: "work",
                  currentRound: prev.currentRound + 1,
                  remainingSeconds: config.workSeconds,
                };
              } else {
                return {
                  ...prev,
                  phase: "finished",
                  isRunning: false,
                  remainingSeconds: 0,
                };
              }
            }
          } else if (prev.phase === "rest") {
            if (prev.currentRound < totalRounds) {
              return {
                ...prev,
                phase: "work",
                currentRound: prev.currentRound + 1,
                remainingSeconds: config.workSeconds,
              };
            } else {
              return {
                ...prev,
                phase: "finished",
                isRunning: false,
                remainingSeconds: 0,
              };
            }
          }
        } else if (isEmom) {
          // EMOM MODE
          const workSec = config.emomWorkSeconds;
          const intervalSec =
            config.emomIntervalSeconds && config.emomIntervalSeconds > 0
              ? config.emomIntervalSeconds
              : 60;
          const restSec = Math.max(intervalSec - workSec, 0);

          if (prev.phase === "work") {
            if (restSec > 0) {
              // Switch to rest until the end of the minute
              return {
                ...prev,
                phase: "rest",
                remainingSeconds: restSec,
              };
            } else {
              // No explicit rest, jump to next minute / round
              if (prev.currentRound < totalRounds) {
                return {
                  ...prev,
                  phase: "work",
                  currentRound: prev.currentRound + 1,
                  remainingSeconds: workSec,
                };
              } else {
                return {
                  ...prev,
                  phase: "finished",
                  isRunning: false,
                  remainingSeconds: 0,
                };
              }
            }
          } else if (prev.phase === "rest") {
            // End of the minute → either next minute or finish
            if (prev.currentRound < totalRounds) {
              return {
                ...prev,
                phase: "work",
                currentRound: prev.currentRound + 1,
                remainingSeconds: workSec,
              };
            } else {
              return {
                ...prev,
                phase: "finished",
                isRunning: false,
                remainingSeconds: 0,
              };
            }
          }
        }

        return prev;
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
    totalRounds,
  ]);

  const resetTimer = () => {
    setTimer({
      phase: "idle",
      isRunning: false,
      isPaused: false,
      currentRound: 0,
      remainingSeconds: 0,
    });
  };

  const startTimer = () => {
    if (isHiit) {
      if (config.workSeconds <= 0 || config.rounds <= 0) return;

      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.workSeconds,
      });
    } else {
      // EMOM
      if (config.emomWorkSeconds <= 0 || config.emomMinutes <= 0) return;

      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.emomWorkSeconds,
      });
    }
  };

  const pauseOrResume = () => {
    if (!timer.isRunning) return;
    setTimer((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const handleModeChange = (mode: Mode) => {
    setConfig((prev) => ({
      ...prev,
      mode,
    }));
    resetTimer();
  };

  const handleConfigChange = (field: keyof Config, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const emomRestSeconds = Math.max(
    (config.emomIntervalSeconds || 60) - (config.emomWorkSeconds || 0),
    0
  );

  const currentPhaseColor =
    timer.phase === "work"
      ? "bg-emerald-500"
      : timer.phase === "rest"
      ? "bg-sky-500"
      : timer.phase === "finished"
      ? "bg-purple-500"
      : "bg-slate-500";

  const title = isHiit ? "HIIT Workout Timer" : "EMOM Workout Timer";
  const subtitle = isHiit
    ? "Set your work/rest intervals or use a preset, then hit start and go."
    : "Every minute on the minute. Work, then rest until the next minute.";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:items-stretch">
        {/* Left: Config */}
        <div className="w-full md:w-2/5">
          <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-slate-800">
            {/* Mode toggle */}
            <div className="mb-4 inline-flex rounded-full bg-slate-900 p-1 ring-1 ring-slate-800">
              <button
                type="button"
                onClick={() => handleModeChange("hiit")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isHiit
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                HIIT
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("emom")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isEmom
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                EMOM
              </button>
            </div>

            <h1 className="mb-2 text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mb-6 text-sm text-slate-400">{subtitle}</p>

            {isHiit ? (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Work (seconds)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={config.workSeconds}
                      onChange={(e) =>
                        handleConfigChange(
                          "workSeconds",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Rest (seconds)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={config.restSeconds}
                      onChange={(e) =>
                        handleConfigChange("restSeconds", Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Rounds
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={config.rounds}
                      onChange={(e) =>
                        handleConfigChange("rounds", Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Presets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          mode: "hiit",
                          workSeconds: 20,
                          restSeconds: 10,
                          rounds: 8,
                        }));
                        resetTimer();
                      }}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-300"
                    >
                      Tabata (20/10 × 8)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          mode: "hiit",
                          workSeconds: 40,
                          restSeconds: 20,
                          rounds: 10,
                        }));
                        resetTimer();
                      }}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-orange-500 hover:text-orange-300"
                    >
                      Burner (40/20 × 10)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Minutes (rounds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={config.emomMinutes}
                      onChange={(e) =>
                        handleConfigChange(
                          "emomMinutes",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Work per minute (seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={config.emomIntervalSeconds}
                      value={config.emomWorkSeconds}
                      onChange={(e) =>
                        handleConfigChange(
                          "emomWorkSeconds",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                      Interval length (seconds)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={config.emomIntervalSeconds}
                      onChange={(e) =>
                        handleConfigChange(
                          "emomIntervalSeconds",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Default is 60 (classic EMOM). Rest each minute is{" "}
                      <span className="font-semibold">
                        {emomRestSeconds} seconds
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-400">
                  <p className="font-medium text-slate-200">How it works:</p>
                  <p className="mt-1">
                    At the start of each interval, you{" "}
                    <span className="font-semibold text-emerald-300">
                      work for {config.emomWorkSeconds}s
                    </span>{" "}
                    then{" "}
                    <span className="font-semibold text-sky-300">
                      rest for {emomRestSeconds}s
                    </span>{" "}
                    until the next minute starts.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Timer */}
        <div className="w-full md:w-3/5">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-slate-800">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                  {totalRounds > 0 && timer.currentRound > 0 ? (
                    <>Round {timer.currentRound} of {totalRounds}</>
                  ) : (
                    <>Ready to go</>
                  )}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${currentPhaseColor}`}
                >
                  {currentPhaseLabel}
                </span>
              </div>

              <div className="mb-6">
                <div className="relative h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-[width]"
                    style={{
                      width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
                      backgroundImage:
                        "linear-gradient(to right, #22c55e, #0ea5e9, #a855f7)",
                    }}
                  />
                </div>
              </div>

              <div className="mb-6 flex flex-col items-center justify-center">
                <div className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-400">
                  {timer.phase === "idle" && "Press start to begin"}
                  {timer.phase === "work" &&
                    (isHiit ? "Go hard" : "Work until you're done")}
                  {timer.phase === "rest" &&
                    (isHiit ? "Breathe" : "Rest until the next minute")}
                  {timer.phase === "finished" && "Nice work"}
                </div>
                <div className="text-6xl font-semibold tabular-nums md:text-7xl">
                  {isIdle ? "00:00" : formatTime(timer.remainingSeconds)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startTimer}
                disabled={timer.isRunning && !timer.isPaused}
                className="min-w-[96px] rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFinished ? "Restart" : "Start"}
              </button>

              <button
                type="button"
                onClick={pauseOrResume}
                disabled={!timer.isRunning}
                className="min-w-[96px] rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timer.isPaused ? "Resume" : "Pause"}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="min-w-[96px] rounded-full border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-red-500 hover:text-red-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}