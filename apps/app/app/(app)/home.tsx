import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { BottomSheet } from "@/ui/BottomSheet";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SparkleIcon, PawIcon } from "@/components/icons/ServiceIcons";
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
  { key: "Hygiene", label: "Hygiene", duration: "20-30 min", price: "₹249" },
  { key: "BlowDry", label: "Blow Dry", duration: "20-30 min", price: "₹199" },
  { key: "NailTrim", label: "Nail Trimming", duration: "15-20 min", price: "₹149" },
  { key: "Spa", label: "Spa Treatment", duration: "60-90 min", price: "₹999" },
  { key: "Cleaning", label: "Cleaning", duration: "45-60 min", price: "₹599" },
] as const;

const SERVICE_IMAGES: Record<string, number> = {
  Bathing: require("@/assets/images/services/bathing.jpg"),
  Cutting: require("@/assets/images/services/cutting.jpg"),
  Hygiene: require("@/assets/images/services/hygiene.jpg"),
  BlowDry: require("@/assets/images/services/blowdry.jpg"),
  NailTrim: require("@/assets/images/services/nailtrim.jpg"),
  Spa: require("@/assets/images/services/spa.jpg"),
  Cleaning: require("@/assets/images/services/cleaning.jpg"),
};

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
  const scrollRef = React.useRef<ScrollView>(null);
  const servicesY = React.useRef(0);

  useEffect(() => {
    if (profile?.pets) setPets(profile.pets);
    if (profile?.location) setLocations(profile.location);
  }, [profile]);

  const primaryLocation = locations[0];

  const scrollToServices = () => {
    scrollRef.current?.scrollTo({ y: servicesY.current, animated: true });
  };

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

  const [heroPackage, ...morePackages] = PACKAGES;

  return (
    <Screen padded={false} edges={["top", "left", "right"]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profile?.name ? `Hi, ${profile.name.split(" ")[0]}` : "Welcome back"}
          </Text>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.locationButton}
              onPress={() => router.push("/(app)/profile/locations" as any)}
            >
              <Ionicons name="location" size={15} color={Colors.light.primary} />
              <Text style={styles.locationLabel} numberOfLines={1}>
                {primaryLocation?.label ?? "Add a location"}
              </Text>
              <Ionicons name="chevron-down" size={13} color={Colors.light.onSurfaceVariant} />
            </Pressable>
            <View style={styles.headerActions}>
              <Pressable
                style={styles.headerIconBtn}
                onPress={() => router.push("/(app)/bookings" as any)}
              >
                <Ionicons name="calendar-outline" size={18} color={Colors.light.ink} />
              </Pressable>
              <Pressable
                style={styles.headerIconBtn}
                onPress={() => router.push("/(app)/profile" as any)}
              >
                <Ionicons name="person-outline" size={18} color={Colors.light.ink} />
              </Pressable>
            </View>
          </View>
          {!!primaryLocation?.address && (
            <Text style={styles.locationAddress} numberOfLines={1}>
              {primaryLocation.address}
            </Text>
          )}
        </View>

        {/* Hero: Quick Book / Multi-day Plan */}
        <View style={styles.heroRow}>
          <Pressable
            style={({ pressed }) => [styles.heroCard, styles.heroCardPrimary, pressed && styles.pressed]}
            onPress={scrollToServices}
          >
            <View style={styles.heroWatermark}>
              <PawIcon size={72} color={Colors.light.onPrimary} />
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="flash" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.heroTitlePrimary}>Quick Book</Text>
            <Text style={styles.heroSubtitlePrimary}>Pick any service below</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.heroCard, styles.heroCardTertiary, pressed && styles.pressed]}
            onPress={() => router.push("/(bulk-booking)" as any)}
          >
            <View style={styles.heroWatermark}>
              <SparkleIcon size={64} color={Colors.light.onTertiary} />
            </View>
            <View style={styles.heroIconWrapDark}>
              <CalendarRangeIcon size={20} color={Colors.light.onTertiary} strokeWidth={1.8} />
            </View>
            <Text style={styles.heroTitleTertiary}>Multi-day Plan</Text>
            <Text style={styles.heroSubtitleTertiary}>Book a whole week at once</Text>
          </Pressable>
        </View>

        {/* Our Services */}
        <View
          style={styles.section}
          onLayout={(e) => {
            servicesY.current = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>Our Services</Text>

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

          <View style={styles.servicesGrid}>
            {filteredServices.map((svc) => {
              const accent = getServiceAccent(svc.key);
              return (
                <Pressable
                  key={svc.key}
                  style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}
                  onPress={() => openServiceSheet(svc.key)}
                >
                  <View style={styles.serviceImageTile}>
                    <Image
                      source={SERVICE_IMAGES[svc.key]}
                      style={styles.serviceImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={[styles.serviceLabelFooter, { backgroundColor: accent.bg }]}>
                    <Text style={styles.serviceName}>{svc.label}</Text>
                    <Text style={styles.serviceDuration}>{svc.duration}</Text>
                    <Text style={[styles.servicePrice, { color: accent.fg }]}>{svc.price}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Popular Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Packages</Text>

          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => Alert.alert(heroPackage.name, heroPackage.services.join(", "))}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoBanner}
            >
              <View style={styles.promoWatermark}>
                <SparkleIcon size={80} color={Colors.light.onPrimary} />
              </View>
              <View style={styles.promoIconWrap}>
                <SparkleIcon size={16} color={Colors.light.primary} />
              </View>
              <Text style={styles.promoTitle}>{heroPackage.name}</Text>
              <Text style={styles.promoServices}>{heroPackage.services.join(" • ")}</Text>
              <View style={styles.promoFooter}>
                <View>
                  <Text style={styles.promoPrice}>{heroPackage.price}</Text>
                  <Text style={styles.promoDiscount}>{heroPackage.discount}</Text>
                </View>
                <View style={styles.promoClaimBtn}>
                  <Text style={styles.promoClaimText}>View</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {morePackages.length > 0 && (
            <View style={styles.packagesContainer}>
              {morePackages.map((pkg) => (
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
          )}
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
                  onChange={(_event, date?: Date) => {
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
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.displayMd,
    fontSize: 22,
    color: Colors.light.ink,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  locationLabel: {
    ...Typography.titleMd,
    color: Colors.light.ink,
    flexShrink: 1,
  },
  locationAddress: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: Spacing.md,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.light.ink,
  },
  heroRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: Spacing.xl,
  },
  heroCard: {
    flex: 1,
    minHeight: 140,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  heroCardPrimary: {
    backgroundColor: Colors.light.primary,
  },
  heroCardTertiary: {
    backgroundColor: Colors.light.tertiary,
  },
  heroWatermark: {
    position: "absolute",
    right: -14,
    bottom: -14,
    opacity: 0.16,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.onPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconWrapDark: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.tertiaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitlePrimary: {
    ...Typography.titleMd,
    fontSize: 17,
    color: Colors.light.onPrimary,
    marginTop: Spacing.md,
  },
  heroSubtitlePrimary: {
    ...Typography.bodySm,
    color: Colors.light.onPrimary,
    opacity: 0.85,
    marginTop: 2,
  },
  heroTitleTertiary: {
    ...Typography.titleMd,
    fontSize: 17,
    color: Colors.light.onTertiary,
    marginTop: Spacing.md,
  },
  heroSubtitleTertiary: {
    ...Typography.bodySm,
    color: Colors.light.onTertiaryContainer,
    marginTop: 2,
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
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.85,
  },
  serviceImageTile: {
    width: "100%",
    aspectRatio: 1.25,
    backgroundColor: Colors.light.surfaceContainerLowest,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  serviceLabelFooter: {
    padding: 14,
    alignItems: "center",
    gap: 4,
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
  },
  promoBanner: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  promoWatermark: {
    position: "absolute",
    right: -20,
    top: -20,
    opacity: 0.14,
  },
  promoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.onPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  promoTitle: {
    ...Typography.headlineLg,
    color: Colors.light.onPrimary,
  },
  promoServices: {
    ...Typography.bodySm,
    color: Colors.light.onPrimary,
    opacity: 0.85,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  promoFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoPrice: {
    ...Typography.displayMd,
    fontSize: 22,
    color: Colors.light.onPrimary,
  },
  promoDiscount: {
    ...Typography.bodySm,
    fontFamily: Fonts.bodyBold,
    color: Colors.light.onPrimary,
    opacity: 0.85,
  },
  promoClaimBtn: {
    backgroundColor: Colors.light.onPrimary,
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  promoClaimText: {
    ...Typography.labelCaps,
    fontSize: 13,
    color: Colors.light.primary,
  },
  packagesContainer: {
    gap: 14,
    marginTop: Spacing.md,
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
