import { useRef } from "react";
import type { TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { AddressSearch } from "@/components/address/AddressSearch";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { StepHeader } from "@/components/ui/StepHeader";
import { TextField } from "@/components/ui/TextField";
import { useProfileWizard } from "@/wizard/ProfileWizard";

export default function AboutYouScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data, setName, setAddress } = useProfileWizard();
  const addressRef = useRef<TextInput>(null);
  const valid = data.name.trim().length > 1 && !!data.address;

  return (
    <Screen
      header={<Header onBack={logout} />}
      footer={
        <Button
          title="Continue"
          iconRight="arrow-right"
          onPress={() => router.push("/(onboarding)/completeProfile/pets")}
          disabled={!valid}
          block
          size="lg"
        />
      }
    >
      <StepHeader
        step={1}
        total={3}
        title="Your details"
        subtitle="Walkers come to this address. You can add more later."
      />
      <TextField
        label="Your name"
        placeholder="Full name"
        value={data.name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => addressRef.current?.focus()}
      />
      <AddressSearch value={data.address} onChange={setAddress} inputRef={addressRef} />
    </Screen>
  );
}
