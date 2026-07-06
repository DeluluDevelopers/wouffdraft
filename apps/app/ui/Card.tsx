import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";
import { Radius, Spacing } from "@/constants/Spacing";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

export function Card({ children, style, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    padding: Spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
});
