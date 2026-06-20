import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import {
  updateProfile,
  createPet,
  updatePet,
  deletePet,
  type PetProfile,
  type CreatePetPayload,
} from "@/lib/api";
import Colors from "@/constants/Colors";

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
  const nameSlideAnim = React.useRef(new Animated.Value(0)).current;
  const nameBackdropAnim = React.useRef(new Animated.Value(0)).current;
  const petSlideAnim = React.useRef(new Animated.Value(0)).current;
  const petBackdropAnim = React.useRef(new Animated.Value(0)).current;

  // Name edit modal
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [editName, setEditName] = useState("");

  // Pet form modal
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [petForm, setPetForm] = useState<PetFormData>(emptyPetForm());
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openNameModal = () => {
    setEditName(profile?.name || "");
    setNameModalVisible(true);
    Animated.parallel([
      Animated.spring(nameSlideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(nameBackdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeNameModal = () => {
    Animated.parallel([
      Animated.timing(nameSlideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameBackdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setNameModalVisible(false));
  };

  const saveName = async () => {
    if (!accessToken || !editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(accessToken, { name: editName.trim() });
      await refreshProfile();
      closeNameModal();
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
    Animated.parallel([
      Animated.spring(petSlideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(petBackdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePetModal = () => {
    Animated.parallel([
      Animated.timing(petSlideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(petBackdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPetModalVisible(false);
      setEditingPetId(null);
    });
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
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeletePet(pet.id),
      },
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

  const nameTranslateY = nameSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });
  const nameBackdropOpacity = nameBackdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });
  const petTranslateY = petSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });
  const petBackdropOpacity = petBackdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const pets = profile?.pets || [];
  const primaryLocation = profile?.location?.[0] || null;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Personal Info Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#A8A8B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile?.name || "Not set"}</Text>
            </View>
            <Pressable onPress={openNameModal} style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color="#4ADE80" />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#A8A8B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile?.phoneNumber || ""}</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <Text style={styles.sectionTitle}>Location</Text>
        <Pressable
          style={styles.card}
          onPress={() => router.push("/(app)/profile/locations")}
        >
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#A8A8B3" />
            <View style={styles.infoContent}>
              {primaryLocation ? (
                <>
                  <Text style={styles.infoValue}>
                    {primaryLocation.address.split(",")[0]}
                  </Text>
                </>
              ) : (
                <Text style={[styles.infoValue, { color: "#666" }]}>
                  No location saved
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#555" />
          </View>
        </Pressable>

        {/* Pets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pets ({pets.length})</Text>
          <Pressable onPress={() => openPetModal()} style={styles.addPetBtn}>
            <Ionicons name="add" size={20} color="#4ADE80" />
            <Text style={styles.addPetText}>Add Pet</Text>
          </Pressable>
        </View>

        {pets.length === 0 ? (
          <Text style={styles.emptyText}>
            No pets added yet. Tap "Add Pet" to get started.
          </Text>
        ) : (
          pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petCardLeft}>
                <View style={styles.petIcon}>
                  <Ionicons
                    name={pet.species === "Dog" ? "paw" : "paw-outline"}
                    size={22}
                    color="#FFFFFF"
                  />
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
                <Pressable
                  onPress={() => openPetModal(pet)}
                  style={styles.petActionBtn}
                >
                  <Ionicons name="pencil" size={18} color="#A8A8B3" />
                </Pressable>
                <Pressable
                  onPress={() => confirmDeletePet(pet)}
                  style={styles.petActionBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeNameModal}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closeNameModal}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: nameBackdropOpacity, backgroundColor: "#000" },
              ]}
            />
          </Pressable>
        </View>
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: nameTranslateY }] },
          ]}
        >
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={100}
              style={styles.keyboardAvoid}
            >
              <View style={styles.sheetContent}>
                <View style={styles.handleRow}>
                  <View style={styles.handle} />
                  <Pressable onPress={closeNameModal} style={styles.closeX}>
                    <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                  </Pressable>
                </View>
                <Text style={styles.sheetTitle}>Edit Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your name"
                  placeholderTextColor={Colors.light.onSurfaceVariant}
                  autoFocus
                />
                <Pressable
                  style={[
                    styles.saveBtn,
                    (!editName.trim() || saving) && styles.saveBtnDisabled,
                  ]}
                  onPress={saveName}
                  disabled={!editName.trim() || saving}
                >
                  {saving ? (
                    <ActivityIndicator color={Colors.light.onPrimary} />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <KeyboardAvoidingView
              behavior="height"
              keyboardVerticalOffset={0}
              style={styles.keyboardAvoid}
            >
              <View style={styles.sheetContent}>
                <View style={styles.handleRow}>
                  <View style={styles.handle} />
                  <Pressable onPress={closeNameModal} style={styles.closeX}>
                    <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                  </Pressable>
                </View>
                <Text style={styles.sheetTitle}>Edit Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your name"
                  placeholderTextColor={Colors.light.onSurfaceVariant}
                  autoFocus
                />
                <Pressable
                  style={[
                    styles.saveBtn,
                    (!editName.trim() || saving) && styles.saveBtnDisabled,
                  ]}
                  onPress={saveName}
                  disabled={!editName.trim() || saving}
                >
                  {saving ? (
                    <ActivityIndicator color={Colors.light.onPrimary} />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          )}
        </Animated.View>
      </Modal>

      {/* Pet Edit/Create Modal */}
      <Modal
        visible={petModalVisible}
        transparent
        animationType="none"
        onRequestClose={closePetModal}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closePetModal}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: petBackdropOpacity, backgroundColor: "#000" },
              ]}
            />
          </Pressable>
        </View>
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: Dimensions.get("window").height * 0.85,
              transform: [{ translateY: petTranslateY }],
            },
          ]}
        >
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={100}
              style={styles.keyboardAvoid}
            >
              <View style={styles.sheetContent}>
                <View style={styles.handleRow}>
                  <View style={styles.handle} />
                  <Pressable onPress={closePetModal} style={styles.closeX}>
                    <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                  </Pressable>
                </View>
                <Text style={styles.sheetTitle}>
                  {editingPetId ? "Edit Pet" : "Add Pet"}
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollArea}
                >
                  {/* Name */}
                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.name}
                    onChangeText={(t) => setPetForm({ ...petForm, name: t })}
                    placeholder="Pet name"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                  />

                  {/* Species */}
                  <Text style={styles.fieldLabel}>Species</Text>
                  <View style={styles.optionRow}>
                    {SPECIES_OPTIONS.map((s) => (
                      <Pressable
                        key={s}
                        style={[
                          styles.optionChip,
                          petForm.species === s && styles.optionChipActive,
                        ]}
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

                  {/* Breed */}
                  <Text style={styles.fieldLabel}>Breed (optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.breed}
                    onChangeText={(t) => setPetForm({ ...petForm, breed: t })}
                    placeholder="e.g. Labrador, Persian"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                  />

                  {/* Age */}
                  <Text style={styles.fieldLabel}>Age (months)</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.ageMonths}
                    onChangeText={(t) =>
                      setPetForm({
                        ...petForm,
                        ageMonths: t.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="e.g. 12"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                    keyboardType="numeric"
                  />

                  {/* Gender */}
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <View style={styles.optionRow}>
                    {GENDER_OPTIONS.map((g) => (
                      <Pressable
                        key={g}
                        style={[
                          styles.optionChip,
                          petForm.gender === g && styles.optionChipActive,
                        ]}
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

                  {/* Vaccination Status */}
                  <Text style={styles.fieldLabel}>Vaccination Status</Text>
                  <View style={styles.optionRow}>
                    {VACCINATION_OPTIONS.map((v) => (
                      <Pressable
                        key={v}
                        style={[
                          styles.optionChip,
                          petForm.vaccinationStatus === v &&
                            styles.optionChipActive,
                        ]}
                        onPress={() =>
                          setPetForm({ ...petForm, vaccinationStatus: v })
                        }
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            petForm.vaccinationStatus === v &&
                              styles.optionChipTextActive,
                          ]}
                        >
                          {v === "UpToDate"
                            ? "Up to Date"
                            : v === "Partial"
                              ? "Partial"
                              : "None"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Medical Conditions */}
                  <View style={styles.switchRow}>
                    <Text style={styles.fieldLabel}>Medical Conditions</Text>
                    <Switch
                      value={petForm.medicalConditions}
                      onValueChange={(v) =>
                        setPetForm({ ...petForm, medicalConditions: v })
                      }
                      trackColor={{ false: Colors.light.surfaceContainer, true: Colors.light.primaryContainer }}
                      thumbColor={petForm.medicalConditions ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
                    />
                  </View>

                  {petForm.medicalConditions && (
                    <>
                      <Text style={styles.fieldLabel}>Medical History</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={petForm.medicalHistory}
                        onChangeText={(t) =>
                          setPetForm({ ...petForm, medicalHistory: t })
                        }
                        placeholder="Describe medical history..."
                        placeholderTextColor={Colors.light.onSurfaceVariant}
                        multiline
                      />
                    </>
                  )}

                  <Pressable
                    style={[
                      styles.saveBtn,
                      (!petForm.name.trim() || !petForm.ageMonths || saving) &&
                        styles.saveBtnDisabled,
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
              </View>
            </KeyboardAvoidingView>
          ) : (
            <KeyboardAvoidingView
              behavior="height"
              keyboardVerticalOffset={0}
              style={styles.keyboardAvoid}
            >
              <View style={styles.sheetContent}>
                <View style={styles.handleRow}>
                  <View style={styles.handle} />
                  <Pressable onPress={closePetModal} style={styles.closeX}>
                    <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                  </Pressable>
                </View>
                <Text style={styles.sheetTitle}>
                  {editingPetId ? "Edit Pet" : "Add Pet"}
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollArea}
                >
                  {/* Name */}
                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.name}
                    onChangeText={(t) => setPetForm({ ...petForm, name: t })}
                    placeholder="Pet name"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                  />

                  {/* Species */}
                  <Text style={styles.fieldLabel}>Species</Text>
                  <View style={styles.optionRow}>
                    {SPECIES_OPTIONS.map((s) => (
                      <Pressable
                        key={s}
                        style={[
                          styles.optionChip,
                          petForm.species === s && styles.optionChipActive,
                        ]}
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

                  {/* Breed */}
                  <Text style={styles.fieldLabel}>Breed (optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.breed}
                    onChangeText={(t) => setPetForm({ ...petForm, breed: t })}
                    placeholder="e.g. Labrador, Persian"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                  />

                  {/* Age */}
                  <Text style={styles.fieldLabel}>Age (months)</Text>
                  <TextInput
                    style={styles.input}
                    value={petForm.ageMonths}
                    onChangeText={(t) =>
                      setPetForm({
                        ...petForm,
                        ageMonths: t.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="e.g. 12"
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                    keyboardType="numeric"
                  />

                  {/* Gender */}
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <View style={styles.optionRow}>
                    {GENDER_OPTIONS.map((g) => (
                      <Pressable
                        key={g}
                        style={[
                          styles.optionChip,
                          petForm.gender === g && styles.optionChipActive,
                        ]}
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

                  {/* Vaccination Status */}
                  <Text style={styles.fieldLabel}>Vaccination Status</Text>
                  <View style={styles.optionRow}>
                    {VACCINATION_OPTIONS.map((v) => (
                      <Pressable
                        key={v}
                        style={[
                          styles.optionChip,
                          petForm.vaccinationStatus === v &&
                            styles.optionChipActive,
                        ]}
                        onPress={() =>
                          setPetForm({ ...petForm, vaccinationStatus: v })
                        }
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            petForm.vaccinationStatus === v &&
                              styles.optionChipTextActive,
                          ]}
                        >
                          {v === "UpToDate"
                            ? "Up to Date"
                            : v === "Partial"
                              ? "Partial"
                              : "None"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Medical Conditions */}
                  <View style={styles.switchRow}>
                    <Text style={styles.fieldLabel}>Medical Conditions</Text>
                    <Switch
                      value={petForm.medicalConditions}
                      onValueChange={(v) =>
                        setPetForm({ ...petForm, medicalConditions: v })
                      }
                      trackColor={{ false: Colors.light.surfaceContainer, true: Colors.light.primaryContainer }}
                      thumbColor={petForm.medicalConditions ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
                    />
                  </View>

                  {petForm.medicalConditions && (
                    <>
                      <Text style={styles.fieldLabel}>Medical History</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={petForm.medicalHistory}
                        onChangeText={(t) =>
                          setPetForm({ ...petForm, medicalHistory: t })
                        }
                        placeholder="Describe medical history..."
                        placeholderTextColor={Colors.light.onSurfaceVariant}
                        multiline
                      />
                    </>
                  )}

                  <Pressable
                    style={[
                      styles.saveBtn,
                      (!petForm.name.trim() || !petForm.ageMonths || saving) &&
                        styles.saveBtnDisabled,
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
              </View>
            </KeyboardAvoidingView>
          )}
        </Animated.View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.light.onSurface,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.02,
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
  card: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
  },
  infoValue: {
    color: Colors.light.onSurface,
    fontSize: 16,
    fontWeight: "500",
  },
  infoSubtext: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    marginTop: 1,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.primaryContainer,
  },
  addPetText: {
    color: Colors.light.onPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    borderRadius: 21,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  petInfo: {
    gap: 2,
    flex: 1,
  },
  petName: {
    color: Colors.light.onSurface,
    fontSize: 16,
    fontWeight: "600",
  },
  petDetail: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
  },
  petActions: {
    flexDirection: "row",
    gap: 8,
  },
  petActionBtn: {
    padding: 8,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get("window").height * 0.85,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: Dimensions.get("window").height * 0.65,
  },
  handleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.outlineVariant,
  },
  closeX: {
    position: "absolute",
    right: 0,
    padding: 4,
  },
  sheetTitle: {
    color: Colors.light.onSurface,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 20,
  },
  scrollArea: {
    maxHeight: Dimensions.get("window").height * 0.55,
  },
  input: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    color: Colors.light.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  fieldLabel: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
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
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    alignItems: "center",
  },
  optionChipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryContainer,
  },
  optionChipText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "600",
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
    height: 54,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.light.surfaceContainer,
    opacity: 0.5,
  },
  saveBtnText: {
    color: Colors.light.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
