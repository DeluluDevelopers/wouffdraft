import React from "react";
import { useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet, Pressable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Card } from "@/ui/Card";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { useAuth } from "@/auth/useAuth";
import { useProfileWizard } from "@/wizard/ProfileWizard";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";

export default function ReviewScreen() {
  const router = useRouter();
  const { data, reset } = useProfileWizard();
  const { finishProfile } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: data.name.trim(),
        label: data.label,
        placeId: data.placeId,
        pets: data.pets.map((p) => ({
          name: p.name.trim(),
          species: p.species,
          breed: p.breed.trim() || undefined,
          ageMonths: parseInt(p.ageMonths, 10),
          gender: p.gender,
          vaccinationStatus: p.vaccinationStatus,
          medicalConditions: p.medicalConditions,
          medicalHistory: p.medicalHistory.trim() || undefined,
        })),
      };
      await finishProfile(payload);
    },
    onSuccess: () => {
      reset();
      router.replace("/(app)/home");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Could not complete profile.";
      Alert.alert("Error", message);
    },
  });

  const onSubmit = () => mutation.mutate();

  return (
    <Screen scroll>
      <WizardStepHeader
        step={3}
        total={3}
        title="Review"
        subtitle="Check everything looks right before saving."
      />

      <Section title="Personal info">
        <Row label="Name" value={data.name} />
      </Section>

      <Section title="Address">
        <Row label="Label" value={data.label} />
      </Section>

      <Section title={`Pets (${data.pets.length})`}>
        {data.pets.map((pet, i) => (
          <Card key={i} style={styles.petSummary}>
            <Text style={styles.petName}>{pet.name || `Pet ${i + 1}`}</Text>
            <Text style={styles.petDetail}>
              {pet.species} &middot; {pet.gender} &middot;{" "}
              {pet.ageMonths || "?"} months
            </Text>
            <Text style={styles.petDetail}>
              Vaccination: {pet.vaccinationStatus}
              {pet.medicalConditions ? " · Has medical conditions" : ""}
            </Text>
          </Card>
        ))}
      </Section>

      <PrimaryButton
        title="Save profile"
        onPress={onSubmit}
        loading={mutation.isPending}
      />

      <Pressable onPress={() => router.back()} style={styles.backWrap}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.light.primary,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  rowLabel: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
  rowValue: {
    ...Typography.bodyMd,
    fontFamily: Typography.headlineMd.fontFamily,
    color: Colors.light.ink,
  },
  petSummary: {
    marginBottom: 8,
  },
  petName: {
    ...Typography.headlineMd,
    color: Colors.light.ink,
    marginBottom: 4,
  },
  petDetail: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
});
