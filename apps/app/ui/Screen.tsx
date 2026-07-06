import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ["top", "left", "right", "bottom"],
  style,
  contentContainerStyle,
}: Props) {
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? {
        contentContainerStyle: [
          padded && styles.padded,
          styles.grow,
          contentContainerStyle,
        ],
        keyboardShouldPersistTaps: "handled" as const,
        showsVerticalScrollIndicator: false,
      }
    : { style: [styles.flex, padded && styles.padded, contentContainerStyle] };

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Container {...(containerProps as any)}>{children}</Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  padded: {
    padding: 20,
  },
});
