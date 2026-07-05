import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string }> = {
  PENDING: { bg: Colors.light.surfaceContainer, text: Colors.light.warning },
  CONFIRMED: { bg: Colors.light.primaryContainer, text: Colors.light.onPrimary },
  COMPLETED: { bg: Colors.light.surfaceContainer, text: Colors.light.success },
  CANCELLED: { bg: Colors.light.errorContainer, text: Colors.light.onErrorContainer },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
