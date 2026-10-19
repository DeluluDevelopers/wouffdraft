import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { colors } from "@/theme";

// Signed-in area. The tab bar is the base screen; every detail screen is
// pushed on top of it, so "back" always returns to where you came from.
export default function SignedInLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!profileCompleted) return <Redirect href="/(onboarding)/completeProfile/address" />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="book/success" options={{ animation: "fade", gestureEnabled: false }} />
    </Stack>
  );
}
