import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CalendarRangeIcon } from "@/components/icons/BulkBookingIcons";
import type { Booking } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

function formatShort(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function GroupSummaryCard({
  bookings,
  onPress,
}: {
  bookings: Booking[];
  onPress: () => void;
}) {
  const sorted = [...bookings].sort((a, b) =>
    (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""),
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const total = bookings.reduce((sum, b) => sum + (b.priceInRupees ?? 0), 0);
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  const activeCount = bookings.length - cancelledCount;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconWrap}>
        <CalendarRangeIcon size={22} color={Colors.light.primary} strokeWidth={1.6} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Multi-day booking · {bookings.length} days</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {first?.scheduledAt && last?.scheduledAt
            ? `${formatShort(first.scheduledAt)} – ${formatShort(last.scheduledAt)}`
            : ""}
          {first?.pet?.name ? ` · ${first.pet.name}` : ""}
        </Text>
        <Text style={styles.progress}>
          {completedCount} of {activeCount} completed
          {cancelledCount > 0 ? ` · ${cancelledCount} cancelled` : ""}
        </Text>
      </View>
      <Text style={styles.total}>₹{total}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  progress: {
    ...Typography.bodySm,
    fontSize: 12,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.primary,
    marginTop: 2,
  },
  total: {
    ...Typography.headlineMd,
    fontSize: 16,
    color: Colors.light.primary,
  },
});
