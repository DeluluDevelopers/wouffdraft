import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Colors from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
};

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: Props) {
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.light.onPrimary : Colors.light.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "secondary" && styles.secondaryText,
            variant === "ghost" && styles.ghostText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.light.ink,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: Colors.light.onPrimary,
    fontSize: 15,
    fontFamily: Fonts.labelBold,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  secondaryText: {
    color: Colors.light.ink,
  },
  ghostText: {
    color: Colors.light.primary,
    textTransform: "none",
  },
});
