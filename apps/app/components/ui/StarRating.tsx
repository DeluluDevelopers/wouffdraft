import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { Icon } from "./Icon";

export function StarRating({
  value,
  onChange,
  size = 34,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityValue={{ min: 0, max: 5, now: value }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <Pressable
            key={star}
            disabled={!onChange}
            onPress={() => onChange?.(star)}
            hitSlop={4}
            accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Icon
              name="star"
              size={size}
              color={filled ? colors.honey : colors.lineStrong}
              fill={filled ? colors.honey : "none"}
              strokeWidth={1.5}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
  },
});
