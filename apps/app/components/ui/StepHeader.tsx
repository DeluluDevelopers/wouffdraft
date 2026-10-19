import { StyleSheet, View } from "react-native";
import { colors, radius } from "@/theme";
import { Text } from "./Text";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
};

export function StepHeader({ step, total, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.progress} accessibilityLabel={`Step ${step} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.segment, i < step && styles.segmentDone]} />
        ))}
      </View>
      <Text variant="caption" color={colors.textMuted}>
        Step {step} of {total}
      </Text>
      <Text variant="titleLg" style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color={colors.textMuted} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
  },
  progress: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.biscuit3,
  },
  segmentDone: {
    backgroundColor: colors.terracotta,
  },
  title: {
    marginTop: 4,
  },
  subtitle: {
    marginTop: 6,
  },
});
