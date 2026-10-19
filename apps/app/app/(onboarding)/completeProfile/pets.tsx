import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { PetForm, draftError, emptyPetDraft, type PetDraft } from "@/components/pets/PetForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { petAge } from "@/lib/format";
import { colors } from "@/theme";
import { useProfileWizard } from "@/wizard/ProfileWizard";

export default function PetsStepScreen() {
  const router = useRouter();
  const { data, setPets } = useProfileWizard();
  const [draft, setDraft] = useState<PetDraft | null>(data.pets.length === 0 ? emptyPetDraft() : null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const savePet = () => {
    if (!draft) return;
    const problem = draftError(draft);
    if (problem) {
      setError(problem);
      return;
    }
    const pets = [...data.pets];
    if (editingIndex != null) pets[editingIndex] = draft;
    else pets.push(draft);
    setPets(pets);
    setDraft(null);
    setEditingIndex(null);
    setError("");
  };

  const footer = draft ? (
    <View style={styles.footerRow}>
      {data.pets.length > 0 ? (
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => {
            setDraft(null);
            setEditingIndex(null);
            setError("");
          }}
          size="lg"
        />
      ) : null}
      <Button title="Save pet" onPress={savePet} block size="lg" style={{ flex: 1 }} />
    </View>
  ) : (
    <Button
      title="Continue"
      iconRight="arrow-right"
      onPress={() => router.push("/(onboarding)/completeProfile/review")}
      disabled={data.pets.length === 0}
      block
      size="lg"
    />
  );

  return (
    <Screen header={<Header />} footer={footer}>
      <StepHeader
        step={2}
        total={3}
        title={data.pets.length === 0 ? "Add your pet" : "Your pets"}
        subtitle="Your walker reads this before each visit."
      />

      {data.pets.map((pet, index) => (
        <Card key={`${pet.name}-${index}`} style={styles.petCard}>
          <PetAvatar name={pet.name} species={pet.species} size={48} />
          <View style={{ flex: 1 }}>
            <Text variant="titleSm">{pet.name}</Text>
            <Text variant="bodySm" color={colors.textMuted}>
              {[pet.breed || pet.species, petAge(pet.ageYears * 12 + pet.ageMonths)].join(" · ")}
            </Text>
          </View>
          <IconButton
            icon="edit"
            label={`Edit ${pet.name}`}
            onPress={() => {
              setDraft(pet);
              setEditingIndex(index);
            }}
          />
          <IconButton
            icon="trash"
            label={`Remove ${pet.name}`}
            onPress={() => setPets(data.pets.filter((_, i) => i !== index))}
          />
        </Card>
      ))}

      {draft ? (
        <View style={styles.form}>
          {error ? (
            <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 12 }}>
              {error}
            </Text>
          ) : null}
          <PetForm value={draft} onChange={setDraft} />
        </View>
      ) : (
        <Button
          title="Add another pet"
          icon="plus"
          variant="outline"
          onPress={() => {
            setDraft(emptyPetDraft());
            setEditingIndex(null);
          }}
          block
          style={styles.addAnother}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  form: {
    marginTop: 8,
  },
  addAnother: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
  },
});
