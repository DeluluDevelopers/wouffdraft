import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, updateProfile } from "@/lib/api";
import { phone } from "@/lib/format";
import { colors } from "@/theme";

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, accessToken, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const emailRef = useRef<TextInput>(null);

  const save = useMutation({
    mutationFn: async () => {
      await updateProfile(accessToken!, { name: name.trim(), email: email.trim() || undefined });
      await refreshProfile();
    },
    onSuccess: () => router.back(),
  });

  const emailValid = !email.trim() || /^\S+@\S+\.\S+$/.test(email.trim());

  return (
    <Screen
      header={<Header title="Your details" />}
      footer={
        <Button
          title="Save"
          onPress={() => save.mutate()}
          loading={save.isPending}
          disabled={name.trim().length < 2 || !emailValid}
          block
          size="lg"
        />
      }
    >
      <TextField
        label="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
        returnKeyType="done"
        label="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="For receipts"
        error={emailValid ? undefined : "Enter a valid email address."}
      />
      <TextField
        label="Mobile number"
        value={phone(profile?.phoneNumber)}
        editable={false}
        hint="Used to log in. Contact support to change it."
      />
      {save.isError ? (
        <Text variant="bodySm" color={colors.danger}>
          {apiErrorMessage(save.error)}
        </Text>
      ) : null}
    </Screen>
  );
}
