import { forwardRef, useRef, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { colors, fonts, radius } from "@/theme";
import { useScrollIntoView } from "./keyboard";
import { Text } from "./Text";

type Props = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, hint, error, prefix, style, onFocus, onBlur, multiline, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<View>(null);
  const scrollIntoView = useScrollIntoView();

  // Wait for the keyboard to finish opening, then nudge the field into view.
  const revealAboveKeyboard = () => {
    setTimeout(() => {
      wrapRef.current?.measureInWindow((_x, y, _w, height) => scrollIntoView?.(y + height));
    }, 300);
  };

  return (
    <View style={styles.wrap} ref={wrapRef}>
      {label ? (
        <Text variant="label" color={colors.textMuted} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, multiline && styles.multiline, focused && styles.focused, !!error && styles.errored]}>
        {prefix ? (
          <View style={styles.prefix}>
            <Text variant="bodyStrong">{prefix}</Text>
          </View>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.terracotta}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          onFocus={(e) => {
            setFocused(true);
            revealAboveKeyboard();
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error ? (
        <Text variant="caption" color={colors.danger} style={styles.below}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color={colors.textSubtle} style={styles.below}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  multiline: {
    alignItems: "flex-start",
  },
  focused: {
    borderColor: colors.charcoal,
  },
  errored: {
    borderColor: colors.brick,
  },
  prefix: {
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceMuted,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  below: {
    marginTop: 6,
  },
});
