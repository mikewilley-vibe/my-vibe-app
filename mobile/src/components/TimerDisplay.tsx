import { StyleSheet, Text, View } from "react-native";
import { Phase } from "../types";
import { colors, phasePill, progressBar } from "../theme";
import { formatTime } from "../utils/formatTime";

type Props = {
  phase: Phase;
  isPaused: boolean;
  isIdle: boolean;
  currentRound: number;
  totalRounds: number;
  remainingSeconds: number;
  progress: number;
  currentPhaseLabel: string;
};

export function TimerDisplay({
  phase,
  isPaused,
  isIdle,
  currentRound,
  totalRounds,
  remainingSeconds,
  progress,
  currentPhaseLabel,
}: Props) {
  const cue =
    phase === "idle"
      ? "Press start to begin"
      : phase === "work"
        ? "Go hard"
        : phase === "rest"
          ? "Breathe"
          : "Nice work";

  const progressPct = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.roundPill}>
          <Text style={styles.roundText}>
            {currentRound > 0
              ? `Round ${currentRound} of ${totalRounds}`
              : "Ready to go"}
          </Text>
        </View>
        <View
          style={[styles.phasePill, { backgroundColor: phasePill[phase] }]}
        >
          <Text style={styles.phaseText}>
            {currentPhaseLabel}
            {isPaused ? " · Paused" : ""}
          </Text>
        </View>
      </View>

      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(progressPct),
        }}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPct}%`,
              backgroundColor: progressBar[phase],
            },
          ]}
        />
      </View>

      <View style={styles.clockBlock}>
        <Text style={styles.cue}>{cue}</Text>
        <Text style={styles.clock} accessibilityLabel={`${formatTime(remainingSeconds)} remaining`}>
          {isIdle ? "00:00" : formatTime(remainingSeconds)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.white10,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    padding: 24,
    gap: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  roundPill: {
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.6)",
    borderWidth: 1,
    borderColor: colors.slate700,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roundText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.slate200,
  },
  phasePill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    borderWidth: 1,
    borderColor: colors.slate700,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  clockBlock: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cue: {
    marginBottom: 12,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.slate400,
  },
  clock: {
    fontSize: 72,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
    color: colors.white,
  },
});
