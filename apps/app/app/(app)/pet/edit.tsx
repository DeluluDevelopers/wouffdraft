import { useState } from "react";
import { Alert, Platform, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { PetForm, draftError, draftFromPet, draftToPayload, emptyPetDraft } from "@/components/pets/PetForm";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { apiErrorMessage, createPet, deletePet, updatePet } from "@/lib/api";
import { colors } from "@/theme";

export default function EditPetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile, accessToken, refreshProfile } = useAuth();
  const existing = profile?.pets.find((pet) => pet.id === id);
  const [draft, setDraft] = useState(existing ? draftFromPet(existing) : emptyPetDraft());
  const [error, setError] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const problem = draftError(draft);
      if (problem) throw new Error(problem);
      const payload = draftToPayload(draft);
      if (existing)
        await updatePet(accessToken!, existing.id, {
          ...payload,
          breed: payload.breed ?? null,
          medicalHistory: payload.medicalHistory ?? null,
        });
      else await createPet(accessToken!, payload);
      await refreshProfile();
    },
    onSuccess: () => router.back(),
    onError: (err) => setError(err instanceof Error && !("response" in err) ? err.message : apiErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: async () => {
      await deletePet(accessToken!, existing!.id);
      await refreshProfile();
    },
    onSuccess: () => router.back(),
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const confirmRemove = () => {
    const message = `Remove ${existing?.name} from your account?`;
    if (Platform.OS === "web") {
      if (globalThis.confirm?.(message)) remove.mutate();
      return;
    }
    Alert.alert("Remove pet", message, [
      { text: "Keep", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => remove.mutate() },
    ]);
  };

  return (
    <Screen
      header={<Header title={existing ? `Edit ${existing.name}` : "Add pet"} />}
      footer={
        <Button
          title={existing ? "Save changes" : "Add pet"}
          onPress={() => save.mutate()}
          loading={save.isPending}
          block
          size="lg"
        />
      }
    >
      <View style={{ height: 8 }} />
      {error ? (
        <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 12 }}>
          {error}
        </Text>
      ) : null}
      <PetForm value={draft} onChange={setDraft} />
      {existing ? (
        <Button
          title="Remove pet"
          variant="danger"
          icon="trash"
          onPress={confirmRemove}
          loading={remove.isPending}
          block
          style={{ marginTop: 8 }}
        />
      ) : null}
    </Screen>
  );
}
