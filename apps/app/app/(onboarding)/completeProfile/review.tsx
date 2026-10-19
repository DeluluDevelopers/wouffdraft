import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { draftToPayload } from "@/components/pets/PetForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { apiErrorMessage } from "@/lib/api";
import { petAge } from "@/lib/format";
import { colors, radius } from "@/theme";
import { useProfileWizard } from "@/wizard/ProfileWizard";

export default function ReviewStepScreen() {
  const router = useRouter();
  const { data, reset } = useProfileWizard();
  const { finishProfile } = useAuth();
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      finishProfile({
        name: data.name.trim(),
        label: data.address!.label,
        placeId: data.address!.placeId,
        pets: data.pets.map(draftToPayload),
      }),
    onSuccess: () => {
      reset();
      router.replace("/home");
    },
    onError: (err) => setError(apiErrorMessage(err, "We couldn't save your profile. Please try again.")),
  });

  if (!data.address || data.pets.length === 0) {
    return (
      <Screen header={<Header />}>
        <Text variant="body">Your name, address or pet details are missing.</Text>
        <Button
          title="Go back to step 1"
          onPress={() => router.replace("/(onboarding)/completeProfile/address")}
          style={{ marginTop: 16 }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      header={<Header />}
      footer={
        <Button
          title="Save and continue"
          onPress={() => mutation.mutate()}
          loading={mutation.isPending}
          block
          size="lg"
        />
      }
    >
      <StepHeader step={3} total={3} title="Check your details" />

      <Card style={styles.block}>
        <Text variant="label" color={colors.textMuted}>
          You
        </Text>
        <Text variant="title" style={{ marginTop: 6 }}>
          {data.name}
        </Text>
        <View style={styles.addressRow}>
          <Icon name="map-pin" size={18} color={colors.terracottaInk} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">{data.address.label}</Text>
            <Text variant="bodySm" color={colors.textMuted}>
              {data.address.description}
            </Text>
          </View>
        </View>
      </Card>

      <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>
        Pets ({data.pets.length})
      </Text>
      {data.pets.map((pet, index) => (
        <Card key={index} style={styles.petCard}>
          <PetAvatar name={pet.name} species={pet.species} size={46} />
          <View style={{ flex: 1 }}>
            <Text variant="titleSm">{pet.name}</Text>
            <Text variant="bodySm" color={colors.textMuted}>
              {[pet.breed || pet.species, petAge(pet.ageYears * 12 + pet.ageMonths), pet.gender].join(" · ")}
            </Text>
          </View>
        </Card>
      ))}

      {error ? (
        <View style={styles.error}>
          <Text variant="bodySm" color="#7E2D22">
            {error}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 2,
  },
  addressRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 10,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  error: {
    marginTop: 12,
    padding: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.brickSoft,
  },
});
