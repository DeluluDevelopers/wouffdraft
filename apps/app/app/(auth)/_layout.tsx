import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/auth/useAuth";

export default function AuthLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0B0F",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuthenticated && profileCompleted)
    return <Redirect href="/(app)/home" />;
  if (isAuthenticated && !profileCompleted)
    return <Redirect href="/(onboarding)/completeProfile" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
