import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import { PawMark } from "../brand/PawMark";

export function LoadingScreen() {
  return (
    <View style={styles.wrap}>
      <PawMark size={64} color={colors.biscuit} />
      <ActivityIndicator color={colors.biscuit} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.terracotta,
  },
  spinner: {
    marginTop: 24,
  },
});
