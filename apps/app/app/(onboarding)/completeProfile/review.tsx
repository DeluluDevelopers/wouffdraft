import React from "react";
import { useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useAuth } from "@/auth/useAuth";
import { useProfileWizard } from "@/wizard/ProfileWizard";

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
    <Screen>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>Review</Text>
          <Text style={styles.subtitle}>
            Check everything looks right before saving.
          </Text>

          <Section title="Personal info">
            <Row label="Name" value={data.name} />
          </Section>

          <Section title="Address">
            <Row label="Label" value={data.label} />
          </Section>

          <Section title={`Pets (${data.pets.length})`}>
            {data.pets.map((pet, i) => (
              <View key={i} style={styles.petSummary}>
                <Text style={styles.petName}>
                  {pet.name || `Pet ${i + 1}`}
                </Text>
                <Text style={styles.petDetail}>
                  {pet.species} &middot; {pet.gender} &middot; {pet.ageMonths || "?"} months
                </Text>
                <Text style={styles.petDetail}>
                  Vaccination: {pet.vaccinationStatus}
                  {pet.medicalConditions ? " · Has medical conditions" : ""}
                </Text>
              </View>
            ))}
          </Section>

          <PrimaryButton
            title="Save profile"
            onPress={onSubmit}
            loading={mutation.isPending}
          />

          <Pressable
            onPress={() => router.back()}
            style={styles.backWrap}
          >
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#21212A",
    marginVertical: 12,
  },
  step: {
    color: "#8B8B96",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#8B8B96",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E26",
  },
  rowLabel: {
    color: "#A8A8B3",
    fontSize: 14,
  },
  rowValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  petSummary: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#16161D",
    marginBottom: 8,
  },
  petName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  petDetail: {
    color: "#A8A8B3",
    fontSize: 13,
    lineHeight: 18,
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: "#D7D7DD",
    fontSize: 14,
  },
});
