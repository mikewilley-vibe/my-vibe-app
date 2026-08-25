import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type Props = {
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  disabledStart: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
};

export function ControlButtons({
  isRunning,
  isPaused,
  isFinished,
  disabledStart,
  onStart,
  onPauseResume,
  onReset,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onStart}
        disabled={disabledStart}
        style={({ pressed }) => [
          styles.primary,
          (disabledStart || pressed) && styles.dimmed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isFinished ? "Restart" : "Start"}
      >
        <Text style={styles.primaryLabel}>
          {isFinished ? "Restart" : "Start"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onPauseResume}
        disabled={!isRunning}
        style={({ pressed }) => [
          styles.secondary,
          (!isRunning || pressed) && styles.dimmed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isPaused ? "Resume" : "Pause"}
      >
        <Text style={styles.secondaryLabel}>
          {isPaused ? "Resume" : "Pause"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onReset}
        style={({ pressed }) => [styles.ghost, pressed && styles.dimmed]}
        accessibilityRole="button"
        accessibilityLabel="Reset"
      >
        <Text style={styles.ghostLabel}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  primary: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: colors.harbor,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  secondary: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.slate600,
    backgroundColor: "rgba(2, 6, 23, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryLabel: {
    color: colors.slate100,
    fontSize: 14,
    fontWeight: "700",
  },
  ghost: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  ghostLabel: {
    color: colors.slate300,
    fontSize: 14,
    fontWeight: "500",
  },
  dimmed: {
    opacity: 0.5,
  },
});
