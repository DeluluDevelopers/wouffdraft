import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
} from "react-native";
import Colors from "@/constants/Colors";

type Props = TextInputProps & {
  label: string;
};

export function TextField({ label, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.light.onSurfaceVariant}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  label: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.02,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.onSurface,
    paddingHorizontal: 16,
    fontSize: 16,
    paddingVertical: 16,
  },
});
