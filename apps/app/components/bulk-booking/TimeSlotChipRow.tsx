import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "./Chip";
import { TIME_SLOTS, type TimeSlotKey } from "@/constants/BulkBookingSlots";
import { Spacing } from "@/constants/Spacing";

export function TimeSlotChipRow({
  selected,
  onSelect,
}: {
  selected: TimeSlotKey | null;
  onSelect: (key: TimeSlotKey) => void;
}) {
  return (
    <View style={styles.row}>
      {TIME_SLOTS.map((slot) => (
        <Chip
          key={slot.key}
          label={slot.label}
          active={selected === slot.key}
          onPress={() => onSelect(slot.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
});
