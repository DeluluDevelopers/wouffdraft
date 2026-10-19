import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { dateKey, upcomingDays } from "@/lib/slots";
import { colors, radius } from "@/theme";
import { Text } from "../ui/Text";

type Props = {
  selected: string[];
  onToggle: (key: string) => void;
  days?: number;
};

// Horizontal day picker. Supports several selected days for packs.
export function DateStrip({ selected, onToggle, days = 21 }: Props) {
  const dates = upcomingDays(days);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {dates.map((date, index) => {
        const key = dateKey(date);
        const active = selected.includes(key);
        return (
          <Pressable
            key={key}
            onPress={() => onToggle(key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={date.toDateString()}
            style={[styles.day, active && styles.dayActive]}
          >
            <Text variant="caption" color={active ? colors.honeySoft : colors.textMuted} style={styles.weekday}>
              {index === 0 ? "Today" : date.toLocaleDateString("en-IN", { weekday: "short" })}
            </Text>
            <Text variant="price" color={active ? colors.biscuit : colors.text}>
              {date.getDate()}
            </Text>
            <Text variant="caption" color={active ? colors.honeySoft : colors.textSubtle}>
              {date.toLocaleDateString("en-IN", { month: "short" })}
            </Text>
            {active ? <View style={styles.dot} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -20,
  },
  row: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  day: {
    width: 64,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  dayActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  weekday: {
    fontFamily: "Archivo-SemiBold",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.honey,
  },
});
