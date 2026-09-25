import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Config } from "../types";
import { colors } from "../theme";

type Props = {
  config: Config;
  isHiit: boolean;
  isEmom: boolean;
  configLocked: boolean;
  emomRestSeconds: number;
  onChange: (field: keyof Config, value: number) => void;
};

function Field({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        keyboardType="number-pad"
        editable={!disabled}
        value={String(value)}
        onChangeText={(text) => {
          const next = Number(text.replace(/[^0-9]/g, ""));
          onChange(Number.isNaN(next) ? 0 : next);
        }}
        accessibilityLabel={label}
      />
    </View>
  );
}

export function ConfigForm({
  config,
  isHiit,
  isEmom,
  configLocked,
  emomRestSeconds,
  onChange,
}: Props) {
  if (isHiit) {
    return (
      <View style={styles.grid}>
        <Field
          label="Work (seconds)"
          value={config.workSeconds}
          disabled={configLocked}
          onChange={(v) => onChange("workSeconds", v)}
        />
        <Field
          label="Rest (seconds)"
          value={config.restSeconds}
          disabled={configLocked}
          onChange={(v) => onChange("restSeconds", v)}
        />
        <Field
          label="Rounds"
          value={config.rounds}
          disabled={configLocked}
          onChange={(v) => onChange("rounds", v)}
        />
      </View>
    );
  }

  if (isEmom) {
    return (
      <View style={styles.grid}>
        <Field
          label="Minutes (rounds)"
          value={config.emomMinutes}
          disabled={configLocked}
          onChange={(v) => onChange("emomMinutes", v)}
        />
        <Field
          label="Work per minute (seconds)"
          value={config.emomWorkSeconds}
          disabled={configLocked}
          onChange={(v) => onChange("emomWorkSeconds", v)}
        />
        <Field
          label="Interval length (seconds)"
          value={config.emomIntervalSeconds}
          disabled={configLocked}
          onChange={(v) => onChange("emomIntervalSeconds", v)}
        />
        <Text style={styles.hint}>
          Rest each minute:{" "}
          <Text style={styles.hintStrong}>{emomRestSeconds}s</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>30 MIN plan</Text>
        <Text style={styles.planBody}>
          Work <Text style={styles.workAccent}>60s</Text>, rest{" "}
          <Text style={styles.restAccent}>30s</Text>, repeat for{" "}
          <Text style={styles.hintStrong}>{config.thirtyMinutes}</Text> rounds.
        </Text>
      </View>
      <Field
        label="Rounds"
        value={config.thirtyMinutes}
        disabled={configLocked}
        onChange={(v) => onChange("thirtyMinutes", v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.slate400,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.8)",
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.slate100,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  hint: {
    fontSize: 12,
    color: colors.slate400,
  },
  hintStrong: {
    fontWeight: "700",
    color: colors.slate200,
  },
  planCard: {
    borderWidth: 1,
    borderColor: colors.slate700,
    backgroundColor: "rgba(2, 6, 23, 0.5)",
    borderRadius: 16,
    padding: 16,
  },
  planTitle: {
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
  },
  planBody: {
    fontSize: 14,
    color: colors.slate300,
    lineHeight: 20,
  },
  workAccent: {
    fontWeight: "700",
    color: colors.emerald300,
  },
  restAccent: {
    fontWeight: "700",
    color: colors.rose300,
  },
});
