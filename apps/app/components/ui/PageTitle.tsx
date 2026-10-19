import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { Text } from "./Text";

// One clear title per screen, with an optional line of context underneath.
export function PageTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text variant="titleLg" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" color={colors.textMuted} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 6,
  },
});
