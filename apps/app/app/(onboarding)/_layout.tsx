import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/ui/LoadingScreen";

export default function OnboardingLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (profileCompleted) return <Redirect href="/(app)/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
