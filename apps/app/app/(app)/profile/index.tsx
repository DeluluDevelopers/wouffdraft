import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { BottomSheet } from "@/ui/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { PawIcon } from "@/components/icons/ServiceIcons";
import {
  updateProfile,
  createPet,
  updatePet,
  deletePet,
  type PetProfile,
  type CreatePetPayload,
} from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

const SPECIES_OPTIONS = ["Dog", "Cat"] as const;
const GENDER_OPTIONS = ["Male", "Female"] as const;
const VACCINATION_OPTIONS = ["UpToDate", "Partial", "None"] as const;

type PetFormData = {
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  ageMonths: string;
  gender: "Male" | "Female";
  vaccinationStatus: "UpToDate" | "Partial" | "None";
  medicalConditions: boolean;
  medicalHistory: string;
};

const emptyPetForm = (): PetFormData => ({
  name: "",
  species: "Dog",
  breed: "",
  ageMonths: "",
  gender: "Male",
  vaccinationStatus: "UpToDate",
  medicalConditions: false,
  medicalHistory: "",
});

export default function ProfileScreen() {
  const { profile, accessToken, refreshProfile } = useAuth();
  const router = useRouter();

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [editName, setEditName] = useState("");

  const [petModalVisible, setPetModalVisible] = useState(false);
  const [petForm, setPetForm] = useState<PetFormData>(emptyPetForm());
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openNameModal = () => {
    setEditName(profile?.name || "");
    setNameModalVisible(true);
  };

  const saveName = async () => {
    if (!accessToken || !editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(accessToken, { name: editName.trim() });
      await refreshProfile();
      setNameModalVisible(false);
    } catch {
      Alert.alert("Error", "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const openPetModal = (pet?: PetProfile) => {
    if (pet) {
      setEditingPetId(pet.id);
      setPetForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "",
        ageMonths: String(pet.ageMonths),
        gender: pet.gender,
        vaccinationStatus: pet.vaccinationStatus,
        medicalConditions: pet.medicalConditions,
        medicalHistory: pet.medicalHistory || "",
      });
    } else {
      setEditingPetId(null);
      setPetForm(emptyPetForm());
    }
    setPetModalVisible(true);
  };

  const closePetModal = () => {
    setPetModalVisible(false);
    setEditingPetId(null);
  };

  const savePet = async () => {
    if (!accessToken) return;
    if (!petForm.name.trim()) {
      Alert.alert("Validation", "Pet name is required");
      return;
    }

    const age = parseInt(petForm.ageMonths, 10);
    if (!age || age <= 0) {
      Alert.alert("Validation", "Please enter a valid age in months");
      return;
    }

    setSaving(true);
    try {
      const payload: CreatePetPayload = {
        name: petForm.name.trim(),
        species: petForm.species,
        breed: petForm.breed.trim() || undefined,
        ageMonths: age,
        gender: petForm.gender,
        vaccinationStatus: petForm.vaccinationStatus,
        medicalConditions: petForm.medicalConditions,
        medicalHistory: petForm.medicalHistory.trim() || undefined,
      };

      if (editingPetId) {
        await updatePet(accessToken, editingPetId, payload);
      } else {
        await createPet(accessToken, payload);
      }

      await refreshProfile();
      closePetModal();
    } catch {
      Alert.alert("Error", "Failed to save pet");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeletePet = (pet: PetProfile) => {
    Alert.alert(`Delete ${pet.name}?`, "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDeletePet(pet.id) },
    ]);
  };

  const handleDeletePet = async (petId: string) => {
    if (!accessToken) return;
    try {
      await deletePet(accessToken, petId);
      await refreshProfile();
    } catch {
      Alert.alert("Error", "Failed to delete pet");
    }
  };

  const pets = profile?.pets || [];
  const primaryLocation = profile?.location?.[0] || null;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Card>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={Colors.light.onSurfaceVariant} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile?.name || "Not set"}</Text>
            </View>
            <Pressable onPress={openNameModal} style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color={Colors.light.primary} />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={Colors.light.onSurfaceVariant} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile?.phoneNumber || ""}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Location</Text>
        <Card onPress={() => router.push("/(app)/profile/locations")}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={Colors.light.onSurfaceVariant} />
            <View style={styles.infoContent}>
              {primaryLocation ? (
                <Text style={styles.infoValue}>{primaryLocation.address.split(",")[0]}</Text>
              ) : (
                <Text style={[styles.infoValue, styles.mutedValue]}>No location saved</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.light.outline} />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pets ({pets.length})</Text>
          <Pressable onPress={() => openPetModal()} style={styles.addPetBtn}>
            <Ionicons name="add" size={18} color={Colors.light.onPrimary} />
            <Text style={styles.addPetText}>Add Pet</Text>
          </Pressable>
        </View>

        {pets.length === 0 ? (
          <Text style={styles.emptyText}>
            No pets added yet. Tap "Add Pet" to get started.
          </Text>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id} style={styles.petCard}>
              <View style={styles.petCardLeft}>
                <View style={styles.petIcon}>
                  <PawIcon size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDetail}>
                    {pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ""} · {pet.ageMonths}mo ·{" "}
                    {pet.gender === "Male" ? "♂" : "♀"}
                  </Text>
                </View>
              </View>
              <View style={styles.petActions}>
                <Pressable onPress={() => openPetModal(pet)} style={styles.petActionBtn}>
                  <Ionicons name="pencil" size={17} color={Colors.light.onSurfaceVariant} />
                </Pressable>
                <Pressable onPress={() => confirmDeletePet(pet)} style={styles.petActionBtn}>
                  <Ionicons name="trash-outline" size={17} color={Colors.light.error} />
                </Pressable>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Name Edit Sheet */}
      <BottomSheet
        visible={nameModalVisible}
        onClose={() => setNameModalVisible(false)}
        title="Edit Name"
      >
        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Your name"
          placeholderTextColor={Colors.light.outline}
          autoFocus
        />
        <Pressable
          style={[styles.saveBtn, (!editName.trim() || saving) && styles.saveBtnDisabled]}
          onPress={saveName}
          disabled={!editName.trim() || saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.light.onPrimary} />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </Pressable>
      </BottomSheet>

      {/* Pet Edit/Create Sheet */}
      <BottomSheet
        visible={petModalVisible}
        onClose={closePetModal}
        title={editingPetId ? "Edit Pet" : "Add Pet"}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={petForm.name}
            onChangeText={(t) => setPetForm({ ...petForm, name: t })}
            placeholder="Pet name"
            placeholderTextColor={Colors.light.outline}
          />

          <Text style={styles.fieldLabel}>Species</Text>
          <View style={styles.optionRow}>
            {SPECIES_OPTIONS.map((s) => (
              <Pressable
                key={s}
                style={[styles.optionChip, petForm.species === s && styles.optionChipActive]}
                onPress={() => setPetForm({ ...petForm, species: s })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    petForm.species === s && styles.optionChipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Breed (optional)</Text>
          <TextInput
            style={styles.input}
            value={petForm.breed}
            onChangeText={(t) => setPetForm({ ...petForm, breed: t })}
            placeholder="e.g. Labrador, Persian"
            placeholderTextColor={Colors.light.outline}
          />

          <Text style={styles.fieldLabel}>Age (months)</Text>
          <TextInput
            style={styles.input}
            value={petForm.ageMonths}
            onChangeText={(t) =>
              setPetForm({ ...petForm, ageMonths: t.replace(/[^0-9]/g, "") })
            }
            placeholder="e.g. 12"
            placeholderTextColor={Colors.light.outline}
            keyboardType="numeric"
          />

          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.optionRow}>
            {GENDER_OPTIONS.map((g) => (
              <Pressable
                key={g}
                style={[styles.optionChip, petForm.gender === g && styles.optionChipActive]}
                onPress={() => setPetForm({ ...petForm, gender: g })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    petForm.gender === g && styles.optionChipTextActive,
                  ]}
                >
                  {g === "Male" ? "♂ Male" : "♀ Female"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Vaccination Status</Text>
          <View style={styles.optionRow}>
            {VACCINATION_OPTIONS.map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.optionChip,
                  petForm.vaccinationStatus === v && styles.optionChipActive,
                ]}
                onPress={() => setPetForm({ ...petForm, vaccinationStatus: v })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    petForm.vaccinationStatus === v && styles.optionChipTextActive,
                  ]}
                >
                  {v === "UpToDate" ? "Up to Date" : v === "Partial" ? "Partial" : "None"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.fieldLabel}>Medical Conditions</Text>
            <Switch
              value={petForm.medicalConditions}
              onValueChange={(v) => setPetForm({ ...petForm, medicalConditions: v })}
              trackColor={{ false: Colors.light.surfaceContainerHigh, true: Colors.light.primary }}
              thumbColor={Colors.light.surfaceContainerLowest}
            />
          </View>

          {petForm.medicalConditions && (
            <>
              <Text style={styles.fieldLabel}>Medical History</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={petForm.medicalHistory}
                onChangeText={(t) => setPetForm({ ...petForm, medicalHistory: t })}
                placeholder="Describe medical history..."
                placeholderTextColor={Colors.light.outline}
                multiline
              />
            </>
          )}

          <Pressable
            style={[
              styles.saveBtn,
              (!petForm.name.trim() || !petForm.ageMonths || saving) && styles.saveBtnDisabled,
            ]}
            onPress={savePet}
            disabled={!petForm.name.trim() || !petForm.ageMonths || saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.light.onPrimary} />
            ) : (
              <Text style={styles.saveBtnText}>
                {editingPetId ? "Save Changes" : "Add Pet"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.displayMd,
    color: Colors.light.ink,
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  infoValue: {
    ...Typography.bodyLg,
    fontSize: 16,
    color: Colors.light.ink,
  },
  mutedValue: {
    color: Colors.light.outline,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.outlineVariant,
    marginVertical: 12,
  },
  editBtn: {
    padding: 6,
  },
  addPetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.primary,
  },
  addPetText: {
    color: Colors.light.onPrimary,
    fontSize: 12,
    fontFamily: Fonts.labelBold,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  petCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  petIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  petInfo: {
    gap: 2,
    flex: 1,
  },
  petName: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  petDetail: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  petActions: {
    flexDirection: "row",
    gap: 8,
  },
  petActionBtn: {
    padding: 8,
  },
  input: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    color: Colors.light.ink,
    fontSize: 16,
    fontFamily: Fonts.body,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  fieldLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    alignItems: "center",
  },
  optionChipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  optionChipText: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.onSurfaceVariant,
  },
  optionChipTextActive: {
    color: Colors.light.onPrimary,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
  saveBtnText: {
    ...Typography.labelCaps,
    fontSize: 14,
    color: Colors.light.onPrimary,
  },
  scrollArea: {
    maxHeight: 520,
  },
});
