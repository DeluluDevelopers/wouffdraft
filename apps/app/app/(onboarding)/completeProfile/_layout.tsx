import { Stack } from "expo-router";
import { ProfileWizardProvider } from "@/wizard/ProfileWizard";

export default function CompleteProfileLayout() {
  return (
    <ProfileWizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileWizardProvider>
  );
}
