import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/ui/LoadingScreen";

export default function AuthLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;

  if (isAuthenticated && profileCompleted)
    return <Redirect href="/(app)/home" />;
  if (isAuthenticated && !profileCompleted)
    return <Redirect href="/(onboarding)/completeProfile/address" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
