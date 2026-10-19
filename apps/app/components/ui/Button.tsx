import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, type } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light" | "danger";
type Size = "md" | "lg" | "sm";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.terracottaInk, fg: colors.biscuit, border: colors.terracottaInk },
  dark: { bg: colors.charcoal, fg: colors.biscuit, border: colors.charcoal },
  outline: { bg: "transparent", fg: colors.charcoal, border: colors.charcoal },
  ghost: { bg: "transparent", fg: colors.charcoal, border: "transparent" },
  light: { bg: colors.biscuit, fg: colors.charcoal, border: colors.biscuit },
  danger: { bg: "transparent", fg: colors.brickInk, border: colors.brickInk },
};

const HEIGHT: Record<Size, number> = { sm: 40, md: 52, lg: 58 };

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading,
  disabled,
  block,
  style,
}: Props) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: size === "sm" ? 16 : 24,
          backgroundColor: v.bg,
          borderColor: v.border,
        },
        block && styles.block,
        inactive && styles.inactive,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={v.fg} strokeWidth={2} /> : null}
          <Text style={[type.button, size === "sm" && styles.smallText]} color={v.fg} numberOfLines={1}>
            {title}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={v.fg} strokeWidth={2} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  block: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  smallText: {
    fontSize: 11.5,
  },
  inactive: {
    opacity: 0.42,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
