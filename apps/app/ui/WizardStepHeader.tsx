import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
};

export function WizardStepHeader({ step, total, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.progressRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.segment, i < step && styles.segmentActive]}
          />
        ))}
      </View>
      <Text style={styles.step}>
        Step {step} of {total}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.lg,
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
  segmentActive: {
    backgroundColor: Colors.light.primary,
  },
  step: {
    ...Typography.labelCaps,
    color: Colors.light.primary,
    marginBottom: 10,
  },
  title: {
    ...Typography.displayMd,
    color: Colors.light.ink,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
});
