import { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfigForm } from "../components/ConfigForm";
import { ControlButtons } from "../components/ControlButtons";
import { ModeSelector } from "../components/ModeSelector";
import { TimerDisplay } from "../components/TimerDisplay";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { colors, phaseBackground } from "../theme";

const beepSource = require("../../assets/beep.wav");

export function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const player = useAudioPlayer(beepSource);
  const {
    config,
    timer,
    soundEnabled,
    setSoundEnabled,
    isHiit,
    isEmom,
    isIdle,
    isFinished,
    configLocked,
    totalRounds,
    emomRestSeconds,
    configError,
    currentPhaseLabel,
    progress,
    title,
    subtitle,
    resetTimer,
    startTimer,
    pauseOrResume,
    handleModeChange,
    handleConfigChange,
  } = useWorkoutTimer();

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
    });
  }, []);

  useEffect(() => {
    if (timer.beepCount <= 0) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (soundEnabled) {
      try {
        player.seekTo(0);
        player.play();
      } catch {
        // ignore beep failures
      }
    }
  }, [timer.beepCount, soundEnabled, player]);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: phaseBackground[timer.phase], paddingTop: insets.top },
      ]}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.configCard}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={styles.iconBadge}>
                <View style={styles.iconInner}>
                  <View style={styles.iconHand} />
                </View>
              </View>
              <View style={styles.brandText}>
                <Text style={styles.eyebrow}>Training tool</Text>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setSoundEnabled((v) => !v)}
              style={styles.soundChip}
              accessibilityRole="button"
              accessibilityState={{ selected: soundEnabled }}
              accessibilityLabel={soundEnabled ? "Mute beeps" : "Enable beeps"}
            >
              <Text style={styles.soundChipLabel}>
                {soundEnabled ? "Sound on" : "Muted"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <ModeSelector mode={config.mode} onChange={handleModeChange} />

          <View style={styles.formWrap}>
            <ConfigForm
              config={config}
              isHiit={isHiit}
              isEmom={isEmom}
              configLocked={configLocked}
              emomRestSeconds={emomRestSeconds}
              onChange={handleConfigChange}
            />
          </View>

          {configError ? (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Text style={styles.errorText}>{configError}</Text>
            </View>
          ) : null}
        </View>

        <TimerDisplay
          phase={timer.phase}
          isPaused={timer.isPaused}
          isIdle={isIdle}
          currentRound={timer.currentRound}
          totalRounds={totalRounds}
          remainingSeconds={timer.remainingSeconds}
          progress={progress}
          currentPhaseLabel={currentPhaseLabel}
        />

        <ControlButtons
          isRunning={timer.isRunning}
          isPaused={timer.isPaused}
          isFinished={isFinished}
          disabledStart={(timer.isRunning && !timer.isPaused) || !!configError}
          onStart={startTimer}
          onPauseResume={pauseOrResume}
          onReset={resetTimer}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  configCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.white10,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.harbor,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 3,
  },
  iconHand: {
    width: 2,
    height: 6,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
  brandText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    color: colors.signal,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  soundChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.slate600,
    backgroundColor: "rgba(2, 6, 23, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  soundChipLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate200,
  },
  subtitle: {
    fontSize: 14,
    color: colors.slate300,
    lineHeight: 20,
  },
  formWrap: {
    marginTop: 4,
  },
  errorBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    backgroundColor: colors.amberBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 14,
    color: colors.amber100,
  },
});
