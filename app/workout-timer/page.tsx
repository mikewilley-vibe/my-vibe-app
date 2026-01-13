"use client";

import { useEffect, useMemo, useState } from "react";

type Phase = "idle" | "work" | "rest" | "finished";
type Mode = "hiit" | "emom" | "thirty"; // 👈 NEW (30 MIN mode)

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

  // HIIT config
  workSeconds: number;
  restSeconds: number;
  rounds: number;

  // EMOM config
  emomMinutes: number; // number of minutes / rounds
  emomWorkSeconds: number; // work duration inside each minute
  emomIntervalSeconds: number; // usually 60

  // 30 MIN config (fixed intervals)
  thirtyMinutes: number; // usually 20
  thirtyWorkSeconds: number; // 60
  thirtyRestSeconds: number; // 30
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

    // 30 MIN defaults (your spec)
    thirtyMinutes: 20, // 20 rounds
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

  const isHiit = config.mode === "hiit";
  const isEmom = config.mode === "emom";
  const isThirty = config.mode === "thirty";

  
  const totalRounds = useMemo(() => {
    if (isHiit) return config.rounds;
    if (isEmom) return config.emomMinutes;
    return config.thirtyMinutes;
  }, [isHiit, isEmom, isThirty, config.rounds, config.emomMinutes, config.thirtyMinutes]);

  const isIdle = timer.phase === "idle";
  const isFinished = timer.phase === "finished";

  const currentPhaseLabel =
    timer.phase === "work"
      ? "Work / Go hard"
      : timer.phase === "rest"
      ? "Rest / Breathe"
      : timer.phase === "finished"
      ? "Done!"
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
          config.emomIntervalSeconds && config.emomIntervalSeconds > 0
            ? config.emomIntervalSeconds
            : 60;
        return Math.max(intervalSec - (config.emomWorkSeconds || 0), 1);
      }

      return config.thirtyRestSeconds || 1;
    }

    return 1;
  }, [
    timer.phase,
    isHiit,
    isEmom,
    isThirty,
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
      : 0;

  // Full-screen background based on phase (your request)
  const screenBg =
    timer.phase === "work"
      ? "bg-emerald-700"
      : timer.phase === "rest"
      ? "bg-red-700"
      : "bg-slate-950";

  const cardBg =
    timer.phase === "work"
      ? "bg-emerald-950/35 ring-emerald-800/60"
      : timer.phase === "rest"
      ? "bg-red-950/35 ring-red-800/60"
      : "bg-slate-900/70 ring-slate-800";

  const currentPhasePill =
    timer.phase === "work"
      ? "bg-emerald-500"
      : timer.phase === "rest"
      ? "bg-red-500"
      : timer.phase === "finished"
      ? "bg-purple-500"
      : "bg-slate-500";
let audioContext: AudioContext | null = null;

const getAudioContext = async (): Promise<AudioContext | null> => {
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioCtx();
    }

    // Resume audio context if suspended (required for iOS)
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    return audioContext;
  } catch (e) {
    console.warn("Audio context not available:", e);
    return null;
  }
};

// Generate a beep sound as a data URL (fallback for iOS)
const generateBeepDataUrl = (): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 0.12; // seconds
  const frequency = 880; // Hz
  const volume = 0.08;

  const samples = new Float32Array(sampleRate * duration);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * volume;
  }

  // Convert to WAV format
  const wav = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(wav.buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, 1, true); // channels (mono)
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(offset, samples[i] < 0 ? samples[i] * 0x8000 : samples[i] * 0x7fff, true);
    offset += 2;
  }

  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
};

const beep = async () => {
  try {
    const ctx = await getAudioContext();
    if (!ctx) {
      // Fallback: try using Audio element
      playBeepFallback();
      return;
    }

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.value = 880; // pitch
    g.gain.value = 0.08;     // volume

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn("Web Audio API beep failed:", e);
    playBeepFallback();
  }
};

const playBeepFallback = () => {
  try {
    const audio = new Audio(generateBeepDataUrl());
    audio.play().catch(e => console.warn("Audio playback failed:", e));
  } catch (e) {
    console.warn("Fallback beep failed:", e);
  }
};

useEffect(() => {
  if (timer.beepCount > 0) {
    beep();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [timer.beepCount]);

  // Timer loop
  useEffect(() => {
    if (!timer.isRunning || timer.isPaused || timer.phase === "idle" || timer.phase === "finished") return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isRunning || prev.isPaused || prev.phase === "idle" || prev.phase === "finished") return prev;

        if (prev.remainingSeconds > 1) {
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        }

        // remainingSeconds is 1 -> advance
        if (isHiit) {
          if (prev.phase === "work") {
            if (config.restSeconds > 0) {
              return { ...prev, phase: "rest", remainingSeconds: config.restSeconds, beepCount: prev.beepCount + 1,};
            }

            // no rest
            if (prev.currentRound < totalRounds) {
              return {
                ...prev,
                phase: "work",
                currentRound: prev.currentRound + 1,
                remainingSeconds: config.workSeconds,
              };
            }

            return { ...prev, phase: "finished", isRunning: false, remainingSeconds: 0 };
          }

          // rest -> next work or finish
          if (prev.currentRound < totalRounds) {
            return {
              ...prev,
              phase: "work",
              currentRound: prev.currentRound + 1,
              remainingSeconds: config.workSeconds, beepCount: prev.beepCount + 1,
            };
          }

          return { ...prev, phase: "finished", isRunning: false, remainingSeconds: 0, beepCount: prev.beepCount + 1 };
        }

        if (isEmom) {
          const workSec = config.emomWorkSeconds;
          const intervalSec =
            config.emomIntervalSeconds && config.emomIntervalSeconds > 0 ? config.emomIntervalSeconds : 60;
          const restSec = Math.max(intervalSec - workSec, 0);

          if (prev.phase === "work") {
            if (restSec > 0) return { ...prev, phase: "rest", remainingSeconds: restSec };

            if (prev.currentRound < totalRounds) {
              return { ...prev, phase: "work", currentRound: prev.currentRound + 1, remainingSeconds: workSec };
            }

            return { ...prev, phase: "finished", isRunning: false, remainingSeconds: 0, beepCount: prev.beepCount + 1, };
          }

          // rest -> next minute
          if (prev.currentRound < totalRounds) {
            return { ...prev, phase: "work", currentRound: prev.currentRound + 1, remainingSeconds: workSec };
          }
          return { ...prev, phase: "finished", isRunning: false, remainingSeconds: 0, beepCount: prev.beepCount + 1, };
        }

        if (isThirty) {
          const workSec = config.thirtyWorkSeconds; // 60
          const restSec = config.thirtyRestSeconds; // 30

          if (prev.phase === "work") {
            // always rest after work
            return { ...prev, phase: "rest", remainingSeconds: restSec };
          }

          // rest -> next work or finish
          if (prev.currentRound < totalRounds) {
            return { ...prev, phase: "work", currentRound: prev.currentRound + 1, remainingSeconds: workSec };
          }

          return { ...prev, phase: "finished", isRunning: false, remainingSeconds: 0, beepCount: prev.beepCount + 1 };
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
    isThirty,
    config.workSeconds,
    config.restSeconds,
    config.rounds,
    config.emomWorkSeconds,
    config.emomIntervalSeconds,
    config.emomMinutes,
    config.thirtyWorkSeconds,
    config.thirtyRestSeconds,
    config.thirtyMinutes,
    totalRounds,
  ]);


  const startTimer = () => {
    if (isHiit) {
      if (config.workSeconds <= 0 || config.rounds <= 0) return;

      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.workSeconds,
        beepCount: 0
      });
      return;
    }

    if (isEmom) {
      if (config.emomWorkSeconds <= 0 || config.emomMinutes <= 0) return;
setTimer((prev) => {
  // ...
  return {
    ...prev,
    phase: "rest",
    remainingSeconds: config.restSeconds,
    beepCount: prev.beepCount + 1,
  };
});
      setTimer({
        phase: "work",
        isRunning: true,
        isPaused: false,
        currentRound: 1,
        remainingSeconds: config.emomWorkSeconds, beepCount: 0
      });
      return;
    }

    // 30 MIN
    if (config.thirtyWorkSeconds <= 0 || config.thirtyMinutes <= 0) return;
setTimer((prev) => {
  // ...
  return {
    ...prev,
    phase: "rest",
    remainingSeconds: config.restSeconds,
    beepCount: prev.beepCount + 1,
  };
});
    setTimer({
      phase: "work",
      isRunning: true,
      isPaused: false,
      currentRound: 1,
      remainingSeconds: config.thirtyWorkSeconds, beepCount: 0
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
const resetTimer = () => {
  setTimer({
    phase: "idle",
    isRunning: false,
    isPaused: false,
    currentRound: 0,
    remainingSeconds: 0,
    beepCount: 0, // 👈 NEW
  });
};

  const handleConfigChange = (field: keyof Config, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const emomRestSeconds = Math.max((config.emomIntervalSeconds || 60) - (config.emomWorkSeconds || 0), 0);

  const title = isHiit ? "HIIT Workout Timer" : isEmom ? "EMOM Workout Timer" : "30 MIN Workout Timer";
  const subtitle = isHiit
    ? "Set your work/rest intervals, then hit start and go."
    : isEmom
    ? "Every minute on the minute. Work, then rest until the next minute."
    : "Work a full minute, rest 30 seconds. Repeat for 20 rounds.";

  return (
    <main className={`min-h-screen ${screenBg} text-slate-100 transition-colors duration-300`}>
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:items-stretch">
        {/* Left: Config */}
        <div className="w-full md:w-2/5">
          <div className={`rounded-2xl p-6 shadow-lg ring-1 ${cardBg}`}>
            {/* Mode toggle */}
            <div className="mb-4 inline-flex rounded-full bg-slate-900/70 p-1 ring-1 ring-slate-800">
              <button
                type="button"
                onClick={() => handleModeChange("hiit")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isHiit ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                HIIT
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("emom")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isEmom ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                EMOM
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("thirty")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isThirty ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                30 MIN
              </button>
            </div>

            <h1 className="mb-2 text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mb-6 text-sm text-slate-200/70">{subtitle}</p>

            {isHiit ? (
              <div className="mb-2 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                    Work (seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={config.workSeconds}
                    onChange={(e) => handleConfigChange("workSeconds", Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                    Rest (seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={config.restSeconds}
                    onChange={(e) => handleConfigChange("restSeconds", Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                    Rounds
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.rounds}
                    onChange={(e) => handleConfigChange("rounds", Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>
            ) : isEmom ? (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                      Minutes (rounds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={config.emomMinutes}
                      onChange={(e) => handleConfigChange("emomMinutes", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                      Work per minute (seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={config.emomIntervalSeconds}
                      value={config.emomWorkSeconds}
                      onChange={(e) => handleConfigChange("emomWorkSeconds", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                      Interval length (seconds)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={config.emomIntervalSeconds}
                      onChange={(e) => handleConfigChange("emomIntervalSeconds", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                    />
                    <p className="mt-1 text-xs text-slate-200/60">
                      Rest each minute is <span className="font-semibold">{emomRestSeconds} seconds</span>.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/50 p-3 text-xs text-slate-200/70">
                  <p className="font-medium text-slate-100">How it works:</p>
                  <p className="mt-1">
                    Every minute starts a new round. You work for{" "}
                    <span className="font-semibold text-emerald-200">{config.emomWorkSeconds}s</span> then rest until
                    the next minute.
                  </p>
                </div>
              </>
            ) : (
              // 30 MIN mode (separate, fixed semantics)
              <>
                <div className="mb-6 rounded-xl bg-slate-950/50 p-4 text-sm text-slate-200/80 ring-1 ring-slate-800">
                  <p className="font-semibold text-slate-100">30 MIN Plan</p>
                  <p className="mt-2">
                    Work <span className="font-semibold text-emerald-200">60 seconds</span>, rest{" "}
                    <span className="font-semibold text-red-200">30 seconds</span>, repeat for{" "}
                    <span className="font-semibold">{config.thirtyMinutes}</span> rounds.
                  </p>
                  <p className="mt-2 text-xs text-slate-200/60">
                    (This is its own mode — not EMOM. It does not align to minute boundaries.)
                  </p>
                </div>

                {/* Optional: let you change round count only */}
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-200/70">
                    Rounds
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.thirtyMinutes}
                    onChange={(e) => handleConfigChange("thirtyMinutes", Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Timer */}
        <div className="w-full md:w-3/5">
          <div className={`flex h-full flex-col justify-between rounded-2xl p-6 shadow-lg ring-1 ${cardBg}`}>
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-100/80 ring-1 ring-slate-800">
                  {totalRounds > 0 && timer.currentRound > 0 ? (
                    <>
                      Round {timer.currentRound} of {totalRounds}
                    </>
                  ) : (
                    <>Ready to go</>
                  )}
                </span>

                {/* Right-side pill */}
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${currentPhasePill}`}>
                  {currentPhaseLabel}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="relative h-2 overflow-hidden rounded-full bg-slate-900/50 ring-1 ring-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200"
                    style={{
                      width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
                      backgroundImage: "linear-gradient(to right, #22c55e, #ef4444, #a855f7)",
                    }}
                  />
                </div>
              </div>

              {/* Clock */}
              <div className="mb-6 flex flex-col items-center justify-center">
                <div className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-100/70">
                  {timer.phase === "idle" && "Press start to begin"}
                  {timer.phase === "work" && "Go hard"}
                  {timer.phase === "rest" && "Breathe"}
                  {timer.phase === "finished" && "Nice work"}
                </div>
                <div className="text-6xl font-semibold tabular-nums md:text-7xl">
                  {isIdle ? "00:00" : formatTime(timer.remainingSeconds)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startTimer}
                disabled={timer.isRunning && !timer.isPaused}
                className="min-w-[96px] rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFinished ? "Restart" : "Start"}
              </button>

              <button
                type="button"
                onClick={pauseOrResume}
                disabled={!timer.isRunning}
                className="min-w-[96px] rounded-full bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-50 ring-1 ring-slate-800 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timer.isPaused ? "Resume" : "Pause"}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="min-w-[96px] rounded-full border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-100/80 hover:border-red-300 hover:text-red-200"
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