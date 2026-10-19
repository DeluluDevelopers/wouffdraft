import { Text as RNText, StyleSheet, type TextProps } from "react-native";
import { colors, type } from "@/theme";
import type { TypeVariant } from "@/theme/typography";

type Props = TextProps & {
  variant?: TypeVariant;
  color?: string;
  align?: "left" | "center" | "right";
};

export function Text({ variant = "body", color = colors.text, align, style, ...props }: Props) {
  // Bimbo/Borel lines are always lowercase, per the brand guidelines.
  const isScript = variant === "display" || variant === "headline" || variant === "script";
  return (
    <RNText
      {...props}
      style={[type[variant], { color }, align ? { textAlign: align } : null, isScript ? styles.script : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  // Borel's strokes swing past the glyph box; Android clips them (e.g. the tail
  // of a final "l"). Extra padding gives them room, and the matching negative
  // margin keeps the text where it was.
  script: {
    textTransform: "lowercase",
    paddingHorizontal: 8,
    marginHorizontal: -8,
    paddingTop: 2,
  },
});
