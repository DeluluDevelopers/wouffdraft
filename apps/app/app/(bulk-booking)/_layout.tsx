import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { LoadingScreen } from "@/ui/LoadingScreen";
import { BulkBookingWizardProvider } from "@/wizard/BulkBookingWizard";

export default function BulkBookingLayout() {
  const { isHydrating, isAuthenticated } = useAuth();

  if (isHydrating) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <BulkBookingWizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </BulkBookingWizardProvider>
  );
}
