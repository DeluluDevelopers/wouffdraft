import { useRef } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";
import type { CreatePetPayload, PetProfile } from "@/lib/api";
import { colors, radius } from "@/theme";
import { Chip } from "../ui/Chip";
import { Icon } from "../ui/Icon";
import { Segmented } from "../ui/Segmented";
import { Text } from "../ui/Text";
import { TextField } from "../ui/TextField";

export type PetDraft = {
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  ageYears: number;
  ageMonths: number;
  gender: "Male" | "Female";
  vaccinationStatus: "UpToDate" | "Partial" | "None";
  medicalConditions: boolean;
  medicalHistory: string;
};

export const emptyPetDraft = (): PetDraft => ({
  name: "",
  species: "Dog",
  breed: "",
  ageYears: 1,
  ageMonths: 0,
  gender: "Male",
  vaccinationStatus: "UpToDate",
  medicalConditions: false,
  medicalHistory: "",
});

export function draftFromPet(pet: PetProfile): PetDraft {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "",
    ageYears: Math.floor(pet.ageMonths / 12),
    ageMonths: pet.ageMonths % 12,
    gender: pet.gender,
    vaccinationStatus: pet.vaccinationStatus,
    medicalConditions: pet.medicalConditions,
    medicalHistory: pet.medicalHistory ?? "",
  };
}

export function draftToPayload(draft: PetDraft): CreatePetPayload {
  return {
    name: draft.name.trim(),
    species: draft.species,
    breed: draft.breed.trim() || undefined,
    ageMonths: Math.max(1, draft.ageYears * 12 + draft.ageMonths),
    gender: draft.gender,
    vaccinationStatus: draft.vaccinationStatus,
    medicalConditions: draft.medicalConditions,
    medicalHistory: draft.medicalConditions ? draft.medicalHistory.trim() || undefined : undefined,
  };
}

export function draftError(draft: PetDraft) {
  if (!draft.name.trim()) return "Add your pet's name.";
  if (draft.ageYears * 12 + draft.ageMonths < 1) return "Add your pet's age.";
  return null;
}

// Common breeds in Indian homes, Indies first.
const BREEDS = {
  Dog: ["Indie", "Labrador", "Golden Retriever", "Beagle", "Shih Tzu", "German Shepherd", "Pug", "Husky"],
  Cat: ["Indie", "Persian", "Siamese", "Maine Coon", "Bengal", "British Shorthair"],
};

const VACCINATION: { value: PetDraft["vaccinationStatus"]; label: string }[] = [
  { value: "UpToDate", label: "Up to date" },
  { value: "Partial", label: "Partial" },
  { value: "None", label: "Not vaccinated" },
];

function Stepper({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Fewer ${label}`}
        onPress={() => onChange(Math.max(0, value - 1))}
        style={styles.stepBtn}
        hitSlop={6}
      >
        <Icon name="minus" size={18} strokeWidth={2.2} />
      </Pressable>
      <View style={styles.stepValue}>
        <Text variant="price">{value}</Text>
        <Text variant="caption" color={colors.textMuted}>
          {label}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`More ${label}`}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={styles.stepBtn}
        hitSlop={6}
      >
        <Icon name="plus" size={18} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

export function PetForm({ value, onChange }: { value: PetDraft; onChange: (draft: PetDraft) => void }) {
  const set = (patch: Partial<PetDraft>) => onChange({ ...value, ...patch });
  const breedRef = useRef<TextInput>(null);
  return (
    <View>
      <TextField
        label="Name"
        placeholder="e.g. Bruno"
        value={value.name}
        onChangeText={(name) => set({ name })}
        autoCapitalize="words"
        maxLength={40}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => breedRef.current?.focus()}
      />

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Species
      </Text>
      <Segmented
        value={value.species}
        onChange={(species) => set({ species, breed: "" })}
        options={[
          { value: "Dog", label: "Dog", icon: "dog" },
          { value: "Cat", label: "Cat", icon: "cat" },
        ]}
      />

      <View style={styles.gap} />
      <TextField
        ref={breedRef}
        label="Breed (optional)"
        returnKeyType="done"
        placeholder={value.species === "Dog" ? "e.g. Indie, Labrador" : "e.g. Indie, Persian"}
        value={value.breed}
        onChangeText={(breed) => set({ breed })}
        autoCapitalize="words"
      />
      <View style={styles.chips}>
        {BREEDS[value.species].map((breed) => (
          <Chip key={breed} label={breed} selected={value.breed === breed} onPress={() => set({ breed })} />
        ))}
      </View>

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Age
      </Text>
      <View style={styles.row}>
        <Stepper
          label={value.ageYears === 1 ? "year" : "years"}
          value={value.ageYears}
          max={25}
          onChange={(ageYears) => set({ ageYears })}
        />
        <Stepper
          label={value.ageMonths === 1 ? "month" : "months"}
          value={value.ageMonths}
          max={11}
          onChange={(ageMonths) => set({ ageMonths })}
        />
      </View>

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Gender
      </Text>
      <Segmented
        value={value.gender}
        onChange={(gender) => set({ gender })}
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Vaccinations
      </Text>
      <View style={styles.chipsTight}>
        {VACCINATION.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value.vaccinationStatus === option.value}
            onPress={() => set({ vaccinationStatus: option.value })}
          />
        ))}
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">Health conditions or medicines</Text>
          <Text variant="bodySm" color={colors.textMuted}>
            Allergies, injuries, anxiety or daily medicines
          </Text>
        </View>
        <Switch
          value={value.medicalConditions}
          onValueChange={(medicalConditions) => set({ medicalConditions })}
          trackColor={{ false: colors.biscuit3, true: colors.terracotta }}
          thumbColor={colors.paper}
        />
      </View>
      {value.medicalConditions ? (
        <TextField
          placeholder="What should your walker know?"
          value={value.medicalHistory}
          onChangeText={(medicalHistory) => set({ medicalHistory })}
          multiline
          maxLength={1000}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
    marginTop: 4,
  },
  gap: {
    height: 18,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -6,
    marginBottom: 22,
  },
  chipsTight: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  stepper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  stepValue: {
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 18,
  },
});
