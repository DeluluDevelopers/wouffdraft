import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Image, Pressable, StyleSheet, View } from "react-native";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { AddressSearch, type AddressChoice } from "@/components/address/AddressSearch";
import { DateStrip } from "@/components/booking/DateStrip";
import { SlotGrid } from "@/components/booking/SlotGrid";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, createBooking, createBulkBooking, createLocation, type ServiceOption } from "@/lib/api";
import {
  CATEGORIES,
  FREE_CANCELLATION_HOURS,
  GROOMING_IMAGES,
  SERVICE_LABELS,
  SERVICE_SUMMARIES,
  categoryBySlug,
  nextPackTier,
  packDiscountPercent,
} from "@/lib/catalog";
import { dayLabel, duration, petAge, rupees, timeLabel } from "@/lib/format";
import { useLocations, useServiceOptions } from "@/lib/queries";
import { combine, dateKey, fromDateKey, isSlotAvailable, slotGroups, upcomingDays, type Slot } from "@/lib/slots";
import { colors, radius } from "@/theme";

const STEPS = ["Service", "Pet", "When", "Where", "Review"] as const;

type When = "asap" | "schedule";

const ALL_SLOTS = slotGroups().flatMap((group) => group.slots);

export default function BookScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ category?: string; pack?: string }>();
  const { profile, accessToken, refreshProfile } = useAuth();
  const category = categoryBySlug(params.category ?? "") ?? CATEGORIES[0]!;
  const { data: allOptions = [], isLoading: optionsLoading } = useServiceOptions();
  const { data: locations = [], refetch: refetchLocations } = useLocations();

  const [step, setStep] = useState(0);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [petId, setPetId] = useState<string | null>(null);
  const [when, setWhen] = useState<When>("schedule");
  const [packMode, setPackMode] = useState(!!params.pack);
  const [dates, setDates] = useState<string[]>(() => (params.pack ? [] : [dateKey(new Date())]));
  const [slotKey, setSlotKey] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressChoice | null>(null);

  const options = useMemo(
    () => allOptions.filter((option) => category.services.includes(option.service)),
    [allOptions, category],
  );
  const option = options.find((o) => o.id === optionId) ?? null;
  const pets = profile?.pets ?? [];
  const eligiblePets = pets.filter((pet) => category.species.includes(pet.species));
  const pet = pets.find((p) => p.id === petId) ?? null;
  const location = locations.find((l) => l.id === locationId) ?? null;
  const slot = ALL_SLOTS.find((s) => s.key === slotKey) ?? null;
  const sortedDates = [...dates].sort();

  // Sensible defaults so a returning customer can book in two taps.
  useEffect(() => {
    if (!optionId && options.length > 0 && category.slug !== "grooming") {
      setOptionId(options[0]!.id);
    }
  }, [options, optionId, category.slug]);
  useEffect(() => {
    if (!petId && eligiblePets.length === 1) setPetId(eligiblePets[0]!.id);
  }, [eligiblePets, petId]);
  useEffect(() => {
    if (!locationId && locations.length > 0) setLocationId(locations[0]!.id);
  }, [locations, locationId]);

  // A pack is always scheduled.
  useEffect(() => {
    if (packMode) setWhen("schedule");
  }, [packMode]);

  const dayCount = when === "asap" ? 1 : Math.max(1, dates.length);
  const discount = packMode ? packDiscountPercent(dayCount) : 0;
  const subtotal = (option?.priceInRupees ?? 0) * dayCount;
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmount;

  const stepValid = [
    !!option,
    !!pet,
    when === "asap" ? true : dates.length >= (packMode ? 2 : 1) && !!slot && isSlotAvailable(sortedDates[0]!, slot),
    !!location,
    true,
  ];

  const toggleDate = (key: string) => {
    setError("");
    if (!packMode) {
      setDates([key]);
      setSlotKey(null);
      return;
    }
    setDates((current) => (current.includes(key) ? current.filter((d) => d !== key) : [...current, key]));
  };

  const applyPreset = (count: number, weekdaysOnly = false) => {
    const picked: string[] = [];
    for (const date of upcomingDays(60).slice(1)) {
      const day = date.getDay();
      if (weekdaysOnly && (day === 0 || day === 6)) continue;
      picked.push(dateKey(date));
      if (picked.length === count) break;
    }
    setDates(picked);
  };

  const confirm = useMutation({
    mutationFn: async () => {
      if (!accessToken || !option || !pet || !location) throw new Error("Missing details");
      if (when === "asap") {
        const booking = await createBooking(accessToken, {
          petId: pet.id,
          locationId: location.id,
          service: option.service,
          serviceOptionId: option.id,
          type: "Instant",
          notes: notes.trim() || undefined,
        });
        return { bookingId: booking.id, groupId: null as string | null };
      }
      if (sortedDates.length === 1) {
        const booking = await createBooking(accessToken, {
          petId: pet.id,
          locationId: location.id,
          service: option.service,
          serviceOptionId: option.id,
          type: "Scheduled",
          scheduledAt: combine(sortedDates[0]!, slot!).toISOString(),
          notes: notes.trim() || undefined,
        });
        return { bookingId: booking.id, groupId: null as string | null };
      }
      const result = await createBulkBooking(accessToken, {
        petId: pet.id,
        locationId: location.id,
        notes: notes.trim() || undefined,
        days: sortedDates.map((key) => ({
          scheduledAt: combine(key, slot!).toISOString(),
          service: option.service,
          serviceOptionId: option.id,
        })),
      });
      return { bookingId: result.bookings[0]?.id ?? null, groupId: result.group.id };
    },
    onSuccess: async ({ bookingId, groupId }) => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      router.replace({
        pathname: "/book/success",
        params: {
          bookingId: bookingId ?? "",
          groupId: groupId ?? "",
          service: option!.service,
          pet: pet!.name,
          when: when === "asap" ? "asap" : combine(sortedDates[0]!, slot!).toISOString(),
          days: String(dayCount),
        },
      });
    },
    onError: (err) => setError(apiErrorMessage(err, "We couldn't place this booking. Please try again.")),
  });

  const saveAddress = useMutation({
    mutationFn: async () => {
      if (!accessToken || !newAddress) throw new Error("No address");
      return createLocation(accessToken, { label: newAddress.label, placeId: newAddress.placeId });
    },
    onSuccess: async (created) => {
      await Promise.all([refetchLocations(), refreshProfile()]);
      setLocationId(created.id);
      setAddingAddress(false);
      setNewAddress(null);
    },
  });

  const goBack = () => {
    setError("");
    if (step === 0) router.back();
    else setStep(step - 1);
  };

  // Android's back button steps back through the flow instead of closing it.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (step === 0) return false;
        setError("");
        setStep((current) => current - 1);
        return true;
      });
      return () => sub.remove();
    }, [step]),
  );

  const next = () => {
    setError("");
    if (step < STEPS.length - 1) setStep(step + 1);
    else confirm.mutate();
  };

  const footer = (
    <View style={styles.footer}>
      <View style={{ flex: 1 }}>
        {option ? (
          <>
            <Text variant="price">{rupees(total)}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {dayCount > 1 ? `${dayCount} visits` : "1 visit"}
              {discount ? ` · ${discount}% off` : ""}
            </Text>
          </>
        ) : (
          <Text variant="bodySm" color={colors.textMuted}>
            Choose a service
          </Text>
        )}
      </View>
      <Button
        title={step === STEPS.length - 1 ? "Confirm booking" : "Continue"}
        iconRight={step === STEPS.length - 1 ? undefined : "arrow-right"}
        onPress={next}
        disabled={!stepValid[step]}
        loading={confirm.isPending}
        size="lg"
      />
    </View>
  );

  return (
    <Screen
      header={
        <View>
          {/* Swiping back would skip every step; the header button steps back instead. */}
          <Stack.Screen options={{ gestureEnabled: step === 0 }} />
          <Header
            title={category.name}
            onBack={goBack}
            right={
              step > 0 ? (
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Icon name="x" size={22} />
                </Pressable>
              ) : null
            }
          />
          <View style={styles.progress}>
            {STEPS.map((label, index) => (
              <View key={label} style={[styles.progressBar, index <= step && styles.progressDone]} />
            ))}
          </View>
        </View>
      }
      footer={footer}
    >
      {/* ---------- 1. Service ---------- */}
      {step === 0 ? (
        <View>
          <View style={styles.hero}>
            <Image source={category.image} style={styles.heroImage} resizeMode="cover" />
            <View style={[styles.heroBadge, { backgroundColor: category.tone }]}>
              <Icon name={category.icon} size={20} />
            </View>
          </View>
          <Text variant="body" color={colors.textMuted} style={{ marginTop: 16 }}>
            {category.description}
          </Text>
          <View style={styles.includes}>
            {category.includes.map((item) => (
              <View key={item} style={styles.include}>
                <Icon name="check" size={14} color={colors.mossInk} strokeWidth={2.6} />
                <Text variant="caption" style={styles.includeText}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="title" style={styles.sectionTitle} accessibilityRole="header">
            {category.slug === "grooming" ? "Treatment" : "Duration"}
          </Text>
          {optionsLoading ? (
            <View style={{ gap: 10 }}>
              <Skeleton height={76} />
              <Skeleton height={76} />
            </View>
          ) : options.length === 0 ? (
            <Text variant="bodySm" color={colors.textMuted}>
              No options are available for this service right now.
            </Text>
          ) : (
            options.map((item) => (
              <OptionCard
                key={item.id}
                option={item}
                grooming={category.slug === "grooming"}
                selected={item.id === optionId}
                onPress={() => setOptionId(item.id)}
              />
            ))
          )}
        </View>
      ) : null}

      {/* ---------- 2. Pet ---------- */}
      {step === 1 ? (
        <View>
          <Text variant="titleLg" style={styles.stepTitle} accessibilityRole="header">
            Which pet?
          </Text>
          {pets.map((item) => {
            const allowed = category.species.includes(item.species);
            const active = item.id === petId;
            return (
              <Pressable
                key={item.id}
                disabled={!allowed}
                onPress={() => setPetId(item.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active, disabled: !allowed }}
                style={[styles.choice, active && styles.choiceActive, !allowed && styles.choiceDisabled]}
              >
                <PetAvatar name={item.name} species={item.species} size={50} />
                <View style={{ flex: 1 }}>
                  <Text variant="titleSm">{item.name}</Text>
                  <Text variant="bodySm" color={colors.textMuted}>
                    {allowed
                      ? [item.breed || item.species, petAge(item.ageMonths)].join(" · ")
                      : "Walks are for dogs only"}
                  </Text>
                </View>
                <Radio active={active} />
              </Pressable>
            );
          })}
          <Button
            title="Add pet"
            icon="plus"
            variant="outline"
            onPress={() => router.push("/pet/edit")}
            style={{ marginTop: 8 }}
          />
        </View>
      ) : null}

      {/* ---------- 3. When ---------- */}
      {step === 2 ? (
        <View>
          <Text variant="titleLg" style={styles.stepTitle} accessibilityRole="header">
            When?
          </Text>

          {!packMode ? (
            <Segmented<When>
              value={when}
              onChange={setWhen}
              options={[
                { value: "schedule", label: "Schedule", icon: "calendar" },
                { value: "asap", label: "As soon as possible", icon: "bolt" },
              ]}
            />
          ) : null}

          {when === "asap" ? (
            <Card tone="muted" style={styles.asap}>
              <Icon name="bolt" size={22} color={colors.terracottaInk} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Nearest available walker</Text>
                <Text variant="bodySm" color={colors.textMuted}>
                  We&apos;ll assign a walker and show their details on the booking once confirmed.
                </Text>
              </View>
            </Card>
          ) : (
            <>
              <View style={styles.packToggle}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">Repeat on several days</Text>
                  <Text variant="bodySm" color={colors.textMuted}>
                    5+ days 5% off · 12+ days 10% · 22+ days 15%
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setPackMode(!packMode);
                    setDates((current) => current.slice(0, 1));
                  }}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: packMode }}
                  style={[styles.switch, packMode && styles.switchOn]}
                >
                  <View style={[styles.knob, packMode && styles.knobOn]} />
                </Pressable>
              </View>

              {packMode ? (
                <View style={styles.presets}>
                  <Chip label="Next 5 days" onPress={() => applyPreset(5)} />
                  <Chip label="Weekdays × 2 weeks" onPress={() => applyPreset(10, true)} />
                  <Chip label="12 days" onPress={() => applyPreset(12)} />
                  <Chip label="22 days" onPress={() => applyPreset(22)} />
                </View>
              ) : null}

              <Text variant="title" style={styles.sectionTitle} accessibilityRole="header">
                {packMode ? `Days${dates.length ? ` · ${dates.length} selected` : ""}` : "Day"}
              </Text>
              <DateStrip selected={dates} onToggle={toggleDate} days={packMode ? 45 : 21} />

              {packMode && dates.length > 0 ? <PackHint days={dates.length} /> : null}

              <Text variant="title" style={styles.sectionTitle} accessibilityRole="header">
                Start time
              </Text>
              <SlotGrid dateKey={sortedDates[0] ?? null} selected={slotKey} onSelect={(s: Slot) => setSlotKey(s.key)} />
            </>
          )}
        </View>
      ) : null}

      {/* ---------- 4. Where ---------- */}
      {step === 3 ? (
        <View>
          <Text variant="titleLg" style={styles.stepTitle} accessibilityRole="header">
            Where?
          </Text>
          {locations.map((item) => {
            const active = item.id === locationId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setLocationId(item.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                style={[styles.choice, active && styles.choiceActive]}
              >
                <View style={styles.addressIcon}>
                  <Icon
                    name={item.label === "Work" ? "building" : item.label === "Home" ? "home" : "map-pin"}
                    size={20}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSm">{item.label.split(",")[0]}</Text>
                  <Text variant="bodySm" color={colors.textMuted} numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
                <Radio active={active} />
              </Pressable>
            );
          })}
          <Button
            title="Add address"
            icon="plus"
            variant="outline"
            onPress={() => setAddingAddress(true)}
            style={{ marginTop: 8 }}
          />
        </View>
      ) : null}

      {/* ---------- 5. Review ---------- */}
      {step === 4 && option && pet && location ? (
        <View>
          <Text variant="titleLg" style={styles.stepTitle} accessibilityRole="header">
            Review booking
          </Text>

          <Card style={{ gap: 0 }} padding={0}>
            <SummaryRow
              icon={category.icon}
              label={SERVICE_LABELS[option.service]}
              value={option.label}
              onEdit={() => setStep(0)}
            />
            <SummaryRow
              icon="paw"
              label={pet.name}
              value={[pet.breed || pet.species, petAge(pet.ageMonths)].join(" · ")}
              onEdit={() => setStep(1)}
            />
            <SummaryRow
              icon="calendar"
              label={
                when === "asap"
                  ? "As soon as possible"
                  : sortedDates.length === 1
                    ? `${dayLabel(fromDateKey(sortedDates[0]!))}, ${slot ? timeLabel(combine(sortedDates[0]!, slot)) : ""}`
                    : `${sortedDates.length} days at ${slot ? timeLabel(combine(sortedDates[0]!, slot)) : ""}`
              }
              value={
                sortedDates.length > 1
                  ? `${dayLabel(fromDateKey(sortedDates[0]!))} to ${dayLabel(fromDateKey(sortedDates[sortedDates.length - 1]!))}`
                  : undefined
              }
              onEdit={() => setStep(2)}
            />
            <SummaryRow
              icon="map-pin"
              label={location.label.split(",")[0]!}
              value={location.address}
              onEdit={() => setStep(3)}
              last
            />
          </Card>

          <View style={{ height: 20 }} />
          <TextField
            label="Notes for your walker (optional)"
            placeholder="Gate code, where the leash is, anything to avoid"
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={1000}
          />

          <Card tone="muted" style={styles.bill}>
            <BillRow
              label={
                dayCount > 1
                  ? `${rupees(option.priceInRupees)} × ${dayCount} visits`
                  : `${SERVICE_LABELS[option.service]} · ${duration(option.durationMinutes)}`
              }
              value={rupees(subtotal)}
            />
            {discountAmount > 0 ? (
              <BillRow label={`Pack discount (${discount}%)`} value={`− ${rupees(discountAmount)}`} accent />
            ) : null}
            <View style={styles.billDivider} />
            <BillRow label="Total" value={rupees(total)} strong />
            <Text variant="caption" color={colors.textMuted} style={{ marginTop: 6 }}>
              Includes GST. Pay after each visit by UPI, card or cash.
            </Text>
          </Card>

          <View style={styles.policy}>
            <Icon name="info" size={18} color={colors.textMuted} />
            <Text variant="caption" color={colors.textMuted} style={{ flex: 1 }}>
              Free cancellation up to {FREE_CANCELLATION_HOURS} hours before each visit.
            </Text>
          </View>
        </View>
      ) : null}

      {error ? (
        <View style={styles.error}>
          <Text variant="bodySm" color="#7E2D22">
            {error}
          </Text>
        </View>
      ) : null}

      <BottomSheet visible={addingAddress} onClose={() => setAddingAddress(false)} title="Add an address">
        <AddressSearch value={newAddress} onChange={setNewAddress} />
        {saveAddress.isError ? (
          <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 12 }}>
            {apiErrorMessage(saveAddress.error)}
          </Text>
        ) : null}
        <Button
          title="Save address"
          onPress={() => saveAddress.mutate()}
          disabled={!newAddress}
          loading={saveAddress.isPending}
          block
          size="lg"
        />
      </BottomSheet>
    </Screen>
  );
}

function OptionCard({
  option,
  grooming,
  selected,
  onPress,
}: {
  option: ServiceOption;
  grooming: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const image = grooming ? GROOMING_IMAGES[option.service] : undefined;
  const title = grooming ? SERVICE_LABELS[option.service] : duration(option.durationMinutes);
  // Drop label parts that only repeat the duration, e.g. "30 min · about 2.5 km" -> "about 2.5 km".
  const detail = grooming
    ? SERVICE_SUMMARIES[option.service]
    : option.label
        .split("·")
        .map((part) => part.trim())
        .filter((part) => !part.startsWith(duration(option.durationMinutes)) && !/^\d+\s*(min|hrs?)\b/.test(part))
        .join(" · ");
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={[styles.option, selected && styles.choiceActive]}
    >
      {image ? <Image source={image} style={styles.optionImage} /> : null}
      <View style={{ flex: 1 }}>
        <Text variant="titleSm">{title}</Text>
        {detail ? (
          <Text variant="bodySm" color={colors.textMuted}>
            {detail}
          </Text>
        ) : null}
      </View>
      <View style={styles.optionPrice}>
        <Text variant="titleSm">{rupees(option.priceInRupees)}</Text>
        <Radio active={selected} />
      </View>
    </Pressable>
  );
}

function Radio({ active }: { active: boolean }) {
  return (
    <View style={[styles.radio, active && styles.radioActive]}>
      {active ? <Icon name="check" size={14} color={colors.biscuit} strokeWidth={3} /> : null}
    </View>
  );
}

function PackHint({ days }: { days: number }) {
  const percent = packDiscountPercent(days);
  const nextTier = nextPackTier(days);
  return (
    <View style={styles.packHint}>
      <Icon name="gift" size={18} color={colors.mossInk} />
      <Text variant="bodySm" style={{ flex: 1 }}>
        {percent ? `${percent}% off. ` : ""}
        {nextTier
          ? `Add ${nextTier.minDays - days} more day${nextTier.minDays - days > 1 ? "s" : ""} for ${nextTier.percent}% off.`
          : ""}
      </Text>
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  onEdit,
  last,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  label: string;
  value?: string;
  onEdit: () => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, !last && styles.summaryDivider]}>
      <View style={styles.summaryIcon}>
        <Icon name={icon} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{label}</Text>
        {value ? (
          <Text variant="bodySm" color={colors.textMuted} numberOfLines={2}>
            {value}
          </Text>
        ) : null}
      </View>
      <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Change ${label}`}>
        <Text variant="bodySm" color={colors.terracottaInk} style={{ fontFamily: "Archivo-SemiBold" }}>
          Change
        </Text>
      </Pressable>
    </View>
  );
}

function BillRow({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text variant={strong ? "titleSm" : "bodySm"} color={accent ? colors.mossInk : colors.text}>
        {label}
      </Text>
      <Text variant={strong ? "price" : "bodyStrong"} color={accent ? colors.mossInk : colors.text}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.biscuit3,
  },
  progressDone: {
    backgroundColor: colors.terracotta,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  hero: {
    marginTop: 8,
    borderRadius: radius.xl,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  includes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  include: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.mossSoft,
  },
  includeText: {
    fontFamily: "Archivo-SemiBold",
    color: "#3C4A28",
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
  },
  stepTitle: {
    marginTop: 8,
    marginBottom: 18,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginBottom: 10,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  optionImage: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  optionPrice: {
    alignItems: "flex-end",
    gap: 8,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  choiceActive: {
    borderColor: colors.charcoal,
    backgroundColor: colors.paper,
  },
  choiceDisabled: {
    opacity: 0.5,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  asap: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  packToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    backgroundColor: colors.biscuit3,
  },
  switchOn: {
    backgroundColor: colors.terracotta,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  knobOn: {
    transform: [{ translateX: 20 }],
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  packHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.mossSoft,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  summaryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  bill: {
    gap: 8,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.lineStrong,
    marginVertical: 4,
  },
  policy: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  error: {
    marginTop: 16,
    padding: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.brickSoft,
  },
});
