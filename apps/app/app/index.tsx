import { Redirect } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/ui/LoadingScreen";

export default function Index() {
  const { isHydrating, isAuthenticated, profileCompleted } = useAuth();

  if (isHydrating) return <LoadingScreen />;

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!profileCompleted)
    return <Redirect href="/(onboarding)/completeProfile/address" />;

  return <Redirect href="/(app)/home" />;
}
