import { StyleSheet, View } from "react-native";
import { colors, radius } from "@/theme";
import { Text } from "./Text";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const STYLES: Record<BookingStatus, { label: string; bg: string; fg: string; dot: string }> = {
  PENDING: { label: "Finding walker", bg: colors.honeySoft, fg: "#6B4A12", dot: colors.honey },
  CONFIRMED: { label: "Confirmed", bg: colors.sageSoft, fg: "#2D4A40", dot: "#5E8C7E" },
  COMPLETED: { label: "Completed", bg: colors.mossSoft, fg: "#3C4A28", dot: colors.moss },
  CANCELLED: { label: "Cancelled", bg: colors.brickSoft, fg: "#7E2D22", dot: colors.brick },
};

export function StatusPill({ status, label }: { status: BookingStatus; label?: string }) {
  const s = STYLES[status] ?? STYLES.PENDING;
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.dot }]} />
      <Text variant="caption" color={s.fg} style={styles.text}>
        {label ?? s.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontFamily: "Archivo-SemiBold",
  },
});
