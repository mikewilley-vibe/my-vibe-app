import { Pressable, StyleSheet, Text, View } from "react-native";
import { MODE_OPTIONS, Mode } from "../types";
import { colors } from "../theme";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      {MODE_OPTIONS.map((option) => {
        const selected = mode === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.id)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    padding: 4,
    borderWidth: 1,
    borderColor: colors.slate700,
  },
  option: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate300,
  },
  labelSelected: {
    color: colors.slate900,
  },
});
