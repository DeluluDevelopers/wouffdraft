import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import {
  createBooking,
  getLocations,
  type PetProfile,
  type LocationProfile,
} from "@/lib/api";

const SERVICES = [
  { key: "Bathing", icon: "water", label: "Bathing" },
  { key: "Cutting", icon: "cut", label: "Cutting" },
  { key: "Hygiene", icon: "shield-checkmark", label: "Hygiene" },
] as const;

type Service = (typeof SERVICES)[number]["key"];
type BookingType = "Instant" | "Scheduled";

export default function HomeScreen() {
  const { profile, accessToken, logout } = useAuth();
  const queryClient = useQueryClient();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [locations, setLocations] = useState<LocationProfile[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [bookingType, setBookingType] = useState<BookingType>("Instant");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (profile?.pets) setPets(profile.pets);
  }, [profile]);

  const openServiceModal = async (service: Service) => {
    setSelectedService(service);
    setSelectedPetId(null);
    setSelectedLocationId(null);
    setBookingType("Instant");
    setScheduledDate(new Date());
    setShowDatePicker(false);
    setModalVisible(true);

    if (accessToken) {
      getLocations(accessToken).then(setLocations).catch(() => {});
    }

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedService(null);
      setSelectedPetId(null);
      setSelectedLocationId(null);
      setScheduledDate(new Date());
      setShowDatePicker(false);
    });
  };

  const confirmBooking = async () => {
    if (!selectedService || !selectedPetId || !selectedLocationId || !accessToken) return;
    if (bookingType === "Scheduled" && !scheduledDate) {
      Alert.alert("Validation", "Please pick a date for the scheduled booking.");
      return;
    }
    setLoading(true);
    try {
      await createBooking(accessToken, {
        petId: selectedPetId,
        locationId: selectedLocationId,
        service: selectedService,
        type: bookingType,
        scheduledAt: bookingType === "Scheduled" ? scheduledDate.toISOString() : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("Booking confirmed", `${selectedService} booked!`);
      closeModal();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await logout();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const canConfirm = selectedPetId && selectedLocationId;

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {profile?.name ? `Hello, ${profile.name}` : "Welcome back"}
          </Text>
          <Text style={styles.subtitle}>What would you like to do?</Text>
        </View>
        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out" size={22} color="#A8A8B3" />
        </Pressable>
      </View>

      <View style={styles.servicesGrid}>
        {SERVICES.map((svc) => (
          <Pressable
            key={svc.key}
            style={styles.serviceCard}
            onPress={() => openServiceModal(svc.key)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={svc.icon as any} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>{svc.label}</Text>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: backdropOpacity, backgroundColor: "#000" }]}
          />
        </Pressable>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          <Pressable style={styles.sheetContent} onPress={() => {}}>
            <View style={styles.handleRow}>
              <View style={styles.handle} />
              <Pressable onPress={closeModal} style={styles.closeX}>
                <Ionicons name="close" size={22} color="#888" />
              </Pressable>
            </View>
            <Text style={styles.sheetTitle}>
              Book {selectedService}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
              {/* Booking Type */}
              <Text style={styles.sectionLabel}>Type</Text>
              <View style={styles.bookingTypeRow}>
                <Pressable
                  style={[
                    styles.bookingTypeChip,
                    bookingType === "Instant" && styles.bookingTypeChipActive,
                  ]}
                  onPress={() => setBookingType("Instant")}
                >
                  <Ionicons
                    name="flash"
                    size={18}
                    color={bookingType === "Instant" ? "#4ADE80" : "#888"}
                  />
                  <Text
                    style={[
                      styles.bookingTypeText,
                      bookingType === "Instant" && styles.bookingTypeTextActive,
                    ]}
                  >
                    Instant
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.bookingTypeChip,
                    bookingType === "Scheduled" && styles.bookingTypeChipActive,
                  ]}
                  onPress={() => setBookingType("Scheduled")}
                >
                  <Ionicons
                    name="calendar"
                    size={18}
                    color={bookingType === "Scheduled" ? "#EAB308" : "#888"}
                  />
                  <Text
                    style={[
                      styles.bookingTypeText,
                      bookingType === "Scheduled" && styles.bookingTypeTextScheduledActive,
                    ]}
                  >
                    Scheduled
                  </Text>
                </Pressable>
              </View>

              {bookingType === "Scheduled" && (
                <>
                  <Text style={styles.sectionLabel}>Pick a date</Text>
                  <Pressable
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#A8A8B3" />
                    <Text style={styles.dateInputText}>
                      {scheduledDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={scheduledDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      minimumDate={new Date()}
                      onValueChange={(_event, date?: Date) => {
                        setShowDatePicker(false);
                        if (date) setScheduledDate(date);
                      }}
                    />
                  )}
                </>
              )}

              <Text style={styles.sectionLabel}>Select a pet</Text>
              {pets.length === 0 ? (
                <Text style={styles.emptyText}>No pets added yet.</Text>
              ) : (
                pets.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.selectRow,
                      selectedPetId === item.id && styles.selectRowActive,
                    ]}
                    onPress={() => setSelectedPetId(item.id)}
                  >
                    <Ionicons
                      name={item.species === "Dog" ? "paw" : "paw-outline"}
                      size={20}
                      color={selectedPetId === item.id ? "#FFFFFF" : "#888"}
                    />
                    <View style={styles.selectText}>
                      <Text
                        style={[
                          styles.selectLabel,
                          selectedPetId === item.id && styles.selectLabelActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.selectDetail}>
                        {item.species} · {item.breed || "Mixed"}
                      </Text>
                    </View>
                    {selectedPetId === item.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                    )}
                  </Pressable>
                ))
              )}

              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                Select a location
              </Text>
              {locations.length === 0 ? (
                <Text style={styles.emptyText}>
                  No locations saved. Add one in profile.
                </Text>
              ) : (
                locations.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.selectRow,
                      selectedLocationId === item.id && styles.selectRowActive,
                    ]}
                    onPress={() => setSelectedLocationId(item.id)}
                  >
                    <Ionicons
                      name="location"
                      size={20}
                      color={selectedLocationId === item.id ? "#FFFFFF" : "#888"}
                    />
                    <View style={styles.selectText}>
                      <Text
                        style={[
                          styles.selectLabel,
                          selectedLocationId === item.id && styles.selectLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      <Text style={styles.selectDetail} numberOfLines={1}>
                        {item.address}
                      </Text>
                    </View>
                    {selectedLocationId === item.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                    )}
                  </Pressable>
                ))
              )}

              <Pressable
                style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
                onPress={confirmBooking}
                disabled={!canConfirm || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0B0B0F" />
                ) : (
                  <Text
                    style={[
                      styles.confirmText,
                      !canConfirm && styles.confirmTextDisabled,
                    ]}
                  >
                    {canConfirm ? "Confirm Booking" : "Select pet & location"}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 15,
  },
  logoutBtn: {
    padding: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#111118",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#21212A",
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1A1A24",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#111118",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
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
    backgroundColor: "#333",
  },
  closeX: {
    position: "absolute",
    right: 0,
    padding: 4,
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  scrollArea: {
    maxHeight: Dimensions.get("window").height * 0.55,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1A1A24",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#21212A",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  dateInputText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  sectionLabel: {
    color: "#8B8B96",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bookingTypeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  bookingTypeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#1A1A24",
    borderWidth: 1,
    borderColor: "#21212A",
  },
  bookingTypeChipActive: {
    borderColor: "#4ADE80",
    backgroundColor: "#1A2A1A",
  },
  bookingTypeText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
  bookingTypeTextActive: {
    color: "#4ADE80",
  },
  bookingTypeTextScheduledActive: {
    color: "#EAB308",
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
    paddingVertical: 12,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: "#16161D",
    borderWidth: 1,
    borderColor: "#21212A",
  },
  selectRowActive: {
    borderColor: "#4ADE80",
    backgroundColor: "#1A2A1A",
  },
  selectText: {
    flex: 1,
    gap: 2,
  },
  selectLabel: {
    color: "#A8A8B3",
    fontSize: 15,
    fontWeight: "600",
  },
  selectLabelActive: {
    color: "#FFFFFF",
  },
  selectDetail: {
    color: "#666",
    fontSize: 12,
  },
  confirmBtn: {
    backgroundColor: "#FFFFFF",
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: "#24242B",
  },
  confirmText: {
    color: "#0B0B0F",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmTextDisabled: {
    color: "#555",
  },
});
