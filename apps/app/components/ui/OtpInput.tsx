import { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, fonts, radius } from "@/theme";
import { Text } from "./Text";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
  autoFocus?: boolean;
};

// One hidden input drives six boxes, so paste and SMS autofill work.
export function OtpInput({ value, onChange, length = 6, error, autoFocus }: Props) {
  const ref = useRef<TextInput>(null);
  const digits = value.split("");
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="One-time code">
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const active = i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              style={[styles.box, digits[i] && styles.filled, active && styles.active, error && styles.error]}
            >
              <Text style={styles.digit}>{digits[i] ?? ""}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  box: {
    flex: 1,
    maxWidth: 54,
    aspectRatio: 0.86,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: {
    borderColor: colors.charcoal,
  },
  active: {
    borderColor: colors.terracotta,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.brick,
  },
  digit: {
    fontFamily: fonts.expandedExtraBold,
    fontSize: 24,
    lineHeight: 30,
  },
  hidden: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
});
