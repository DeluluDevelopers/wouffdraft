import { Pressable, StyleSheet } from "react-native";
import { colors, radius } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
};

export function Chip({ label, selected, onPress, icon, disabled }: Props) {
  const fg = selected ? colors.biscuit : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={fg} strokeWidth={2} /> : null}
      <Text variant="bodySm" color={fg} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  selected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: "Archivo-SemiBold",
  },
});
