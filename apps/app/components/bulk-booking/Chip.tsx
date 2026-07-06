import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      {icon && <View style={styles.chipIcon}>{icon}</View>}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
  },
  chipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  chipIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.onSurfaceVariant,
  },
  chipTextActive: {
    color: Colors.light.onPrimary,
  },
});
