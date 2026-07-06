import React from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Card } from "@/ui/Card";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { useProfileWizard, type PetForm } from "@/wizard/ProfileWizard";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

const SPECIES = ["Dog", "Cat"] as const;
const GENDERS = ["Male", "Female"] as const;
const VACCINATION = ["UpToDate", "Partial", "None"] as const;

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segRow}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={[styles.segOption, value === opt && styles.segActive]}
        >
          <Text style={[styles.segText, value === opt && styles.segTextActive]}>
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function PetCard({
  pet,
  index,
  onChange,
  onRemove,
}: {
  pet: PetForm;
  index: number;
  onChange: (pet: PetForm) => void;
  onRemove: () => void;
}) {
  const update = (partial: Partial<PetForm>) => onChange({ ...pet, ...partial });

  return (
    <Card style={styles.petCard}>
      <View style={styles.petHeader}>
        <Text style={styles.petTitle}>Pet {index + 1}</Text>
        <Pressable onPress={onRemove}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>

      <Text style={styles.fieldLabel}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet name"
        placeholderTextColor={Colors.light.outline}
        value={pet.name}
        onChangeText={(v) => update({ name: v })}
      />

      <Text style={styles.fieldLabel}>Species</Text>
      <SegmentedControl
        options={SPECIES}
        value={pet.species}
        onChange={(v) => update({ species: v })}
      />

      <Text style={styles.fieldLabel}>Breed (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Golden Retriever"
        placeholderTextColor={Colors.light.outline}
        value={pet.breed}
        onChangeText={(v) => update({ breed: v })}
      />

      <Text style={styles.fieldLabel}>Age (months)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 12"
        placeholderTextColor={Colors.light.outline}
        keyboardType="number-pad"
        value={pet.ageMonths}
        onChangeText={(v) => update({ ageMonths: v })}
      />

      <Text style={styles.fieldLabel}>Gender</Text>
      <SegmentedControl
        options={GENDERS}
        value={pet.gender}
        onChange={(v) => update({ gender: v })}
      />

      <Text style={styles.fieldLabel}>Vaccination status</Text>
      <SegmentedControl
        options={VACCINATION}
        value={pet.vaccinationStatus}
        onChange={(v) => update({ vaccinationStatus: v })}
      />

      <View style={styles.toggleRow}>
        <Text style={styles.fieldLabel}>Medical conditions</Text>
        <Pressable
          onPress={() => update({ medicalConditions: !pet.medicalConditions })}
          style={[styles.toggle, pet.medicalConditions && styles.toggleActive]}
        >
          <Text
            style={[
              styles.toggleText,
              pet.medicalConditions && styles.toggleTextActive,
            ]}
          >
            {pet.medicalConditions ? "Yes" : "No"}
          </Text>
        </Pressable>
      </View>

      {pet.medicalConditions && (
        <>
          <Text style={styles.fieldLabel}>Medical history</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe any conditions..."
            placeholderTextColor={Colors.light.outline}
            multiline
            value={pet.medicalHistory}
            onChangeText={(v) => update({ medicalHistory: v })}
          />
        </>
      )}
    </Card>
  );
}

export default function PetsScreen() {
  const router = useRouter();
  const { data, addPet, updatePet, removePet } = useProfileWizard();

  const onNext = () => {
    if (data.pets.length === 0) {
      Alert.alert("Add a pet", "You need at least one pet to continue.");
      return;
    }
    const invalid = data.pets.findIndex(
      (p) => !p.name.trim() || !p.ageMonths.trim(),
    );
    if (invalid !== -1) {
      Alert.alert(
        "Incomplete pet",
        `Please fill in the name and age for pet ${invalid + 1}.`,
      );
      return;
    }
    router.push("/(onboarding)/completeProfile/review");
  };

  return (
    <Screen scroll>
      <WizardStepHeader
        step={2}
        total={3}
        title="Your Pets"
        subtitle="Add details about each pet you'd like to register."
      />

      {data.pets.map((pet, i) => (
        <PetCard
          key={i}
          pet={pet}
          index={i}
          onChange={(p) => updatePet(i, p)}
          onRemove={() => removePet(i)}
        />
      ))}

      <Pressable style={styles.addBtn} onPress={addPet}>
        <Text style={styles.addBtnText}>
          {data.pets.length === 0 ? "+ Add a pet" : "+ Add another pet"}
        </Text>
      </Pressable>

      {data.pets.length > 0 && <PrimaryButton title="Next" onPress={onNext} />}

      <Pressable onPress={() => router.back()} style={styles.backWrap}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  petCard: {
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  petTitle: {
    ...Typography.headlineMd,
    color: Colors.light.ink,
  },
  removeText: {
    color: Colors.light.error,
    fontSize: 14,
    fontFamily: Typography.bodyMd.fontFamily,
  },
  fieldLabel: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
    fontFamily: Typography.labelCaps.fontFamily,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    color: Colors.light.ink,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Typography.bodyMd.fontFamily,
  },
  multiline: {
    height: 80,
    paddingTop: 14,
  },
  segRow: {
    flexDirection: "row",
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    overflow: "hidden",
  },
  segOption: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surfaceContainerLowest,
  },
  segActive: {
    backgroundColor: Colors.light.primary,
  },
  segText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontFamily: Fonts.bodyMedium,
  },
  segTextActive: {
    color: Colors.light.onPrimary,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  toggle: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: Colors.light.primaryContainer,
    borderColor: Colors.light.primary,
  },
  toggleText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontFamily: Fonts.bodyMedium,
  },
  toggleTextActive: {
    color: Colors.light.onPrimaryContainer,
  },
  addBtn: {
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outline,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addBtnText: {
    color: Colors.light.primary,
    fontSize: 15,
    fontFamily: Fonts.bodyMedium,
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontFamily: Typography.bodyMd.fontFamily,
  },
});
