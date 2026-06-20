import React from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useProfileWizard, type PetForm } from "@/wizard/ProfileWizard";
import Colors from "@/constants/Colors";

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
          style={[
            styles.segOption,
            value === opt && styles.segActive,
          ]}
        >
          <Text
            style={[
              styles.segText,
              value === opt && styles.segTextActive,
            ]}
          >
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
    <View style={styles.petCard}>
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
        placeholderTextColor={Colors.light.onSurfaceVariant}
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
        placeholderTextColor={Colors.light.onSurfaceVariant}
        value={pet.breed}
        onChangeText={(v) => update({ breed: v })}
      />

      <Text style={styles.fieldLabel}>Age (months)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 12"
        placeholderTextColor={Colors.light.onSurfaceVariant}
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
          style={[
            styles.toggle,
            pet.medicalConditions && styles.toggleActive,
          ]}
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
            placeholderTextColor={Colors.light.onSurfaceVariant}
            multiline
            value={pet.medicalHistory}
            onChangeText={(v) => update({ medicalHistory: v })}
          />
        </>
      )}
    </View>
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
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.step}>Step 2 of 3</Text>
          <Text style={styles.title}>Your pets</Text>
          <Text style={styles.subtitle}>
            Add details about each pet you'd like to register.
          </Text>

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
              {data.pets.length === 0
                ? "+ Add a pet"
                : "+ Add another pet"}
            </Text>
          </Pressable>

          {data.pets.length > 0 && (
            <PrimaryButton title="Next" onPress={onNext} />
          )}

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

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  step: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.02,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: Colors.light.onSurface,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  petCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    marginBottom: 16,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  petHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  petTitle: {
    color: Colors.light.onSurface,
    fontSize: 17,
    fontWeight: "700",
  },
  removeText: {
    color: Colors.light.error,
    fontSize: 14,
  },
  fieldLabel: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.onSurface,
    paddingHorizontal: 16,
    fontSize: 16,
    paddingVertical: 16,
  },
  multiline: {
    height: 80,
    paddingTop: 14,
  },
  segRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    overflow: "hidden",
  },
  segOption: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  segActive: {
    backgroundColor: Colors.light.primaryContainer,
  },
  segText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "600",
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
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderWidth: 1,
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
    fontWeight: "600",
    fontSize: 14,
  },
  toggleTextActive: {
    color: Colors.light.onPrimary,
  },
  addBtn: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addBtnText: {
    color: Colors.light.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
  },
});