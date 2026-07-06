import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { BottomSheet } from "@/ui/BottomSheet";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { ServiceIcons, SparkleIcon, PawIcon } from "@/components/icons/ServiceIcons";
import { CalendarRangeIcon } from "@/components/icons/BulkBookingIcons";
import {
  createBooking,
  getLocations,
  type PetProfile,
  type LocationProfile,
} from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";
import { getServiceAccent } from "@/constants/ServiceAccents";

const SERVICES = [
  { key: "Bathing", label: "Bathing", duration: "30-45 min", price: "₹499" },
  { key: "Cutting", label: "Hair Cutting", duration: "45-60 min", price: "₹599" },
  { key: "BlowDry", label: "Blow Dry", duration: "20-30 min", price: "₹199" },
  { key: "NailTrim", label: "Nail Trimming", duration: "15-20 min", price: "₹149" },
  { key: "Spa", label: "Spa Treatment", duration: "60-90 min", price: "₹999" },
  { key: "Cleaning", label: "Cleaning", duration: "45-60 min", price: "₹599" },
] as const;

const PACKAGES = [
  {
    id: "1",
    name: "Grooming Package",
    services: ["Bathing", "Hair Cutting", "BlowDry"],
    price: "₹1,299",
    discount: "20% OFF",
    tagBg: Colors.light.lilac,
    tagFg: Colors.light.onLilac,
  },
  {
    id: "2",
    name: "Premium Spa",
    services: ["Spa Treatment", "NailTrim", "Cleaning"],
    price: "₹1,799",
    discount: "15% OFF",
    tagBg: Colors.light.lemon,
    tagFg: Colors.light.onLemon,
  },
] as const;

type Service = "Bathing" | "Cutting" | "Hygiene" | "BlowDry" | "NailTrim" | "Spa" | "Cleaning";
type BookingType = "Instant" | "Scheduled";

export default function HomeScreen() {
  const router = useRouter();
  const { profile, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [locations, setLocations] = useState<LocationProfile[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>("Instant");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (profile?.pets) setPets(profile.pets);
  }, [profile]);

  const openServiceSheet = (service: Service) => {
    setSelectedService(service);
    setSelectedPetId(null);
    setSelectedLocationId(null);
    setBookingType("Instant");
    setScheduledDate(new Date());
    setShowDatePicker(false);
    setSheetVisible(true);

    if (accessToken) {
      getLocations(accessToken).then(setLocations).catch(() => {});
    }
  };

  const closeSheet = () => {
    setSheetVisible(false);
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
      closeSheet();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = !!(selectedPetId && selectedLocationId);

  const filteredServices = SERVICES.filter((svc) =>
    svc.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Screen padded={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profile?.name ? `Hi, ${profile.name.split(" ")[0]}` : "Welcome back"}
          </Text>
          <Text style={styles.subtitle}>What would you like to book today?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={19} color={Colors.light.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={Colors.light.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Multi-day booking CTA */}
        <Pressable
          style={({ pressed }) => [styles.bulkCta, pressed && styles.pressed]}
          onPress={() => router.push("/(bulk-booking)" as any)}
        >
          <View style={styles.bulkCtaIcon}>
            <CalendarRangeIcon size={22} color={Colors.light.onTertiary} strokeWidth={1.6} />
          </View>
          <View style={styles.bulkCtaText}>
            <Text style={styles.bulkCtaTitle}>Book multiple days</Text>
            <Text style={styles.bulkCtaSubtitle}>
              Plan a whole week of visits in one go
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.light.onTertiary} />
        </Pressable>

        {/* Our Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            {filteredServices.map((svc) => {
              const Icon = ServiceIcons[svc.key];
              const accent = getServiceAccent(svc.key);
              return (
                <Pressable
                  key={svc.key}
                  style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}
                  onPress={() => openServiceSheet(svc.key)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: accent.bg }]}>
                    <Icon size={26} color={accent.fg} strokeWidth={1.6} />
                  </View>
                  <Text style={styles.serviceName}>{svc.label}</Text>
                  <Text style={styles.serviceDuration}>{svc.duration}</Text>
                  <Text style={styles.servicePrice}>{svc.price}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Popular Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Packages</Text>
          <View style={styles.packagesContainer}>
            {PACKAGES.map((pkg) => (
              <Pressable
                key={pkg.id}
                style={({ pressed }) => [styles.packageCard, pressed && styles.pressed]}
                onPress={() => Alert.alert(pkg.name, pkg.services.join(", "))}
              >
                <View style={[styles.packageTag, { backgroundColor: pkg.tagBg }]}>
                  <SparkleIcon size={12} color={pkg.tagFg} />
                </View>
                <View style={styles.packageContent}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageServices}>{pkg.services.join(" • ")}</Text>
                  <View style={styles.packagePriceRow}>
                    <Text style={styles.packagePrice}>{pkg.price}</Text>
                    <Text style={styles.packageDiscount}>{pkg.discount}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Booking Sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={closeSheet}
        title={selectedService ? `Book ${selectedService}` : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
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
                color={bookingType === "Instant" ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
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
                color={bookingType === "Scheduled" ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.bookingTypeText,
                  bookingType === "Scheduled" && styles.bookingTypeTextActive,
                ]}
              >
                Scheduled
              </Text>
            </Pressable>
          </View>

          {bookingType === "Scheduled" && (
            <>
              <Text style={styles.sectionLabel}>Pick a date</Text>
              <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color={Colors.light.onSurfaceVariant} />
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
                style={[styles.selectRow, selectedPetId === item.id && styles.selectRowActive]}
                onPress={() => setSelectedPetId(item.id)}
              >
                <PawIcon
                  size={18}
                  color={selectedPetId === item.id ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
                />
                <View style={styles.selectText}>
                  <Text
                    style={[styles.selectLabel, selectedPetId === item.id && styles.selectLabelActive]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.selectDetail, selectedPetId === item.id && styles.selectDetailActive]}
                  >
                    {item.species} · {item.breed || "Mixed"}
                  </Text>
                </View>
                {selectedPetId === item.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.onPrimary} />
                )}
              </Pressable>
            ))
          )}

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Select a location</Text>
          {locations.length === 0 ? (
            <Text style={styles.emptyText}>No locations saved. Add one in profile.</Text>
          ) : (
            locations.map((item) => (
              <Pressable
                key={item.id}
                style={[styles.selectRow, selectedLocationId === item.id && styles.selectRowActive]}
                onPress={() => setSelectedLocationId(item.id)}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color={selectedLocationId === item.id ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
                />
                <View style={styles.selectText}>
                  <Text
                    style={[styles.selectLabel, selectedLocationId === item.id && styles.selectLabelActive]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.selectDetail, selectedLocationId === item.id && styles.selectDetailActive]}
                    numberOfLines={1}
                  >
                    {item.address}
                  </Text>
                </View>
                {selectedLocationId === item.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.onPrimary} />
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
              <ActivityIndicator color={Colors.light.onPrimary} />
            ) : (
              <Text style={[styles.confirmText, !canConfirm && styles.confirmTextDisabled]}>
                {canConfirm ? "Confirm Booking" : "Select pet & location"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: Spacing.md,
  },
  greeting: {
    ...Typography.displayMd,
    color: Colors.light.ink,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: Spacing.lg,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.light.ink,
  },
  bulkCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.light.tertiary,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: Spacing.lg,
  },
  bulkCtaIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.tertiaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  bulkCtaText: {
    flex: 1,
    gap: 2,
  },
  bulkCtaTitle: {
    ...Typography.titleMd,
    color: Colors.light.onTertiary,
  },
  bulkCtaSubtitle: {
    ...Typography.bodySm,
    color: Colors.light.onTertiaryContainer,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.displayMd,
    fontSize: 26,
    color: Colors.light.ink,
    marginBottom: Spacing.md,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  serviceName: {
    ...Typography.titleMd,
    color: Colors.light.ink,
    textAlign: "center",
  },
  serviceDuration: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  servicePrice: {
    ...Typography.headlineMd,
    color: Colors.light.primary,
  },
  packagesContainer: {
    gap: 14,
  },
  packageCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    padding: 18,
    alignItems: "flex-start",
    gap: 14,
  },
  packageTag: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  packageContent: {
    flex: 1,
    gap: 6,
  },
  packageName: {
    ...Typography.headlineMd,
    color: Colors.light.ink,
  },
  packageServices: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  packagePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  packagePrice: {
    ...Typography.headlineLg,
    fontSize: 18,
    color: Colors.light.primary,
  },
  packageDiscount: {
    ...Typography.bodySm,
    fontFamily: Fonts.bodyBold,
    color: Colors.light.onSuccessContainer,
  },
  scrollArea: {
    maxHeight: 560,
  },
  sectionLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 10,
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
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
  },
  bookingTypeChipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  bookingTypeText: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.onSurfaceVariant,
  },
  bookingTypeTextActive: {
    color: Colors.light.onPrimary,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  dateInputText: {
    ...Typography.bodyMd,
    color: Colors.light.ink,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    paddingVertical: 12,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    marginBottom: 6,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
  },
  selectRowActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  selectText: {
    flex: 1,
    gap: 2,
  },
  selectLabel: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
  selectLabelActive: {
    color: Colors.light.onPrimary,
  },
  selectDetail: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  selectDetailActive: {
    color: Colors.light.onPrimary,
    opacity: 0.85,
  },
  confirmBtn: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
  confirmText: {
    ...Typography.labelCaps,
    fontSize: 14,
    color: Colors.light.onPrimary,
  },
  confirmTextDisabled: {
    color: Colors.light.onSurfaceVariant,
  },
});
