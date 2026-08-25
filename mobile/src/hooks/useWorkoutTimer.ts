import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Config,
  DEFAULT_CONFIG,
  IDLE_TIMER,
  Mode,
  TimerState,
} from "../types";
import { formatTime } from "../utils/formatTime";

export function useWorkoutTimer() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [timer, setTimer] = useState<TimerState>(IDLE_TIMER);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
      if (config.emomWorkSeconds <= 0)
        return "Work per minute must be greater than 0.";
      if (config.emomWorkSeconds >= config.emomIntervalSeconds) {
        return "Work time must be shorter than the interval length.";
      }
      if (config.emomIntervalSeconds < 10) {
        return "Interval length must be at least 10 seconds.";
      }
    }
    if (isThirty && config.thirtyMinutes <= 0)
      return "Rounds must be at least 1.";
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
    if (timer.phase === "idle")
      return "Timer ready. Configure intervals, then start.";
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

  const resetTimer = useCallback(() => {
    setTimer(IDLE_TIMER);
  }, []);

  const startTimer = useCallback(() => {
    if (configError) return;

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
  }, [
    configError,
    isHiit,
    isEmom,
    config.workSeconds,
    config.emomWorkSeconds,
    config.thirtyWorkSeconds,
  ]);

  const pauseOrResume = useCallback(() => {
    setTimer((prev) => {
      if (!prev.isRunning) return prev;
      return { ...prev, isPaused: !prev.isPaused };
    });
  }, []);

  const handleModeChange = useCallback(
    (mode: Mode) => {
      setConfig((prev) => ({ ...prev, mode }));
      resetTimer();
    },
    [resetTimer]
  );

  const handleConfigChange = useCallback(
    (field: keyof Config, value: number) => {
      setConfig((prev) => ({
        ...prev,
        [field]: Number.isNaN(value) ? 0 : value,
      }));
    },
    []
  );

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

  return {
    config,
    timer,
    soundEnabled,
    setSoundEnabled,
    isHiit,
    isEmom,
    isThirty,
    isIdle,
    isFinished,
    configLocked,
    totalRounds,
    emomRestSeconds,
    configError,
    currentPhaseLabel,
    progress,
    statusMessage,
    title,
    subtitle,
    resetTimer,
    startTimer,
    pauseOrResume,
    handleModeChange,
    handleConfigChange,
  };
}
