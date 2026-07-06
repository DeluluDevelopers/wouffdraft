import React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";

export function LoadingScreen() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("@/assets/images/brand/wouff-mark.png")}
        style={styles.mark}
        resizeMode="contain"
      />
      <ActivityIndicator color={Colors.light.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  mark: {
    width: 72,
    height: 72,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 4,
  },
});
