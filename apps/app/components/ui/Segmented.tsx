import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Option<T extends string> = { value: T; label: string; icon?: IconName };

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[styles.option, active && styles.active]}
          >
            {option.icon ? <Icon name={option.icon} size={16} color={colors.text} strokeWidth={2} /> : null}
            <Text variant="bodySm" style={styles.label} color={active ? colors.text : colors.textMuted}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: colors.surface,
    shadowColor: "#2D2D2B",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  label: {
    fontFamily: "Archivo-SemiBold",
  },
});
