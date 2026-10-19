import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { PawMark } from "@/components/brand/PawMark";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { colors } from "@/theme";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <PawMark size={56} />
      <Text variant="titleLg" align="center" style={{ marginTop: 16, marginBottom: 24 }}>
        Page not found
      </Text>
      <Button title="Go to home" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
});
