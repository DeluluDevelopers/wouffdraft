import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
} from "react-native";
import Colors from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.light.outline}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  label: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
    fontFamily: Fonts.labelBold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    color: Colors.light.ink,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.body,
  },
  inputFocused: {
    borderColor: Colors.light.primary,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.light.error,
  },
});
