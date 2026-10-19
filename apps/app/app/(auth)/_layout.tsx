import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function AuthLayout() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;

  if (isAuthenticated && profileCompleted) return <Redirect href="/home" />;
  if (isAuthenticated && !profileCompleted) return <Redirect href="/(onboarding)/completeProfile/address" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
