import { Pressable, StyleSheet } from "react-native";
import { colors, radius } from "@/theme";
import { Icon, type IconName } from "./Icon";

type Props = {
  icon: IconName;
  onPress?: () => void;
  label: string;
  tone?: "surface" | "dark" | "clear";
  size?: number;
};

export function IconButton({ icon, onPress, label, tone = "surface", size = 44 }: Props) {
  const bg = tone === "dark" ? colors.charcoal : tone === "clear" ? "transparent" : colors.surface;
  const fg = tone === "dark" ? colors.biscuit : colors.charcoal;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, backgroundColor: bg },
        tone === "surface" && styles.bordered,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={icon} size={20} color={fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.line,
  },
});
