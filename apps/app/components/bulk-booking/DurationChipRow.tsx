import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "./Chip";
import type { ServiceOption } from "@/lib/api";
import { Spacing } from "@/constants/Spacing";

export function DurationChipRow({
  options,
  selectedId,
  onSelect,
}: {
  options: ServiceOption[];
  selectedId: string | null;
  onSelect: (option: ServiceOption) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Chip
          key={option.id}
          label={`${option.label} · ₹${option.priceInRupees}`}
          active={selectedId === option.id}
          onPress={() => onSelect(option)}
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
