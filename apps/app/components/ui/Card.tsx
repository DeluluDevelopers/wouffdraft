import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, shadow } from "@/theme";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: "surface" | "muted" | "dark" | "terracotta";
  elevated?: boolean;
  padding?: number;
  accessibilityLabel?: string;
};

const TONES = {
  surface: { backgroundColor: colors.surface, borderColor: colors.line },
  muted: { backgroundColor: colors.surfaceMuted, borderColor: "transparent" },
  dark: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  terracotta: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
};

export function Card({
  children,
  onPress,
  style,
  tone = "surface",
  elevated,
  padding = 18,
  accessibilityLabel,
}: Props) {
  const base = [styles.card, TONES[tone], { padding }, elevated && shadow.card, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
