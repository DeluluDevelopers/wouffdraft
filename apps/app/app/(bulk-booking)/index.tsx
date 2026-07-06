import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { PawIcon } from "@/components/icons/ServiceIcons";
import { getLocations, type LocationProfile } from "@/lib/api";
import { useBulkBookingWizard } from "@/wizard/BulkBookingWizard";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

export default function BulkBookingDatesScreen() {
  const router = useRouter();
  const { profile, accessToken } = useAuth();
  const { data, setPet, setLocation, toggleDate } = useBulkBookingWizard();
  const [locations, setLocations] = useState<LocationProfile[]>([]);

  useEffect(() => {
    if (accessToken) {
      getLocations(accessToken).then(setLocations).catch(() => {});
    }
  }, [accessToken]);

  const markedDates = Object.fromEntries(
    data.days.map((day) => [
      day.date,
      {
        selected: true,
        selectedColor: Colors.light.primary,
        selectedTextColor: Colors.light.onPrimary,
      },
    ]),
  );

  const todayIso = new Date().toISOString().slice(0, 10);
  const canContinue = !!data.petId && !!data.locationId && data.days.length >= 2;

  return (
    <Screen scroll>
      <WizardStepHeader
        step={1}
        total={3}
        title="Choose your dates"
        subtitle="Tap every day you'd like a visit — pick at least 2 to build a multi-day booking."
      />

      <Text style={styles.sectionLabel}>Select a pet</Text>
      {(profile?.pets ?? []).length === 0 ? (
        <Text style={styles.emptyText}>No pets added yet.</Text>
      ) : (
        (profile?.pets ?? []).map((pet) => (
          <Pressable
            key={pet.id}
            style={[styles.selectRow, data.petId === pet.id && styles.selectRowActive]}
            onPress={() => setPet(pet.id)}
          >
            <PawIcon
              size={18}
              color={data.petId === pet.id ? Colors.light.onPrimary : Colors.light.onSurfaceVariant}
            />
            <Text
              style={[styles.selectLabel, data.petId === pet.id && styles.selectLabelActive]}
            >
              {pet.name}
            </Text>
          </Pressable>
        ))
      )}

      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Select a location</Text>
      {locations.length === 0 ? (
        <Text style={styles.emptyText}>No locations saved. Add one in profile.</Text>
      ) : (
        locations.map((location) => (
          <Pressable
            key={location.id}
            style={[
              styles.selectRow,
              data.locationId === location.id && styles.selectRowActive,
            ]}
            onPress={() => setLocation(location.id)}
          >
            <Text
              style={[
                styles.selectLabel,
                data.locationId === location.id && styles.selectLabelActive,
              ]}
              numberOfLines={1}
            >
              {location.label}
            </Text>
          </Pressable>
        ))
      )}

      <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Pick your dates</Text>
      <Card style={styles.calendarCard}>
        <Calendar
          minDate={todayIso}
          markedDates={markedDates}
          onDayPress={(day: DateData) => toggleDate(day.dateString)}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: Colors.light.onSurfaceVariant,
            selectedDayBackgroundColor: Colors.light.primary,
            selectedDayTextColor: Colors.light.onPrimary,
            todayTextColor: Colors.light.primary,
            dayTextColor: Colors.light.ink,
            textDisabledColor: Colors.light.outline,
            arrowColor: Colors.light.ink,
            monthTextColor: Colors.light.ink,
            textDayFontFamily: Fonts.body,
            textMonthFontFamily: Fonts.labelBold,
            textDayHeaderFontFamily: Fonts.bodyMedium,
            textDayFontSize: 15,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
        />
      </Card>

      {data.days.length > 0 && (
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {data.days.length} day{data.days.length === 1 ? "" : "s"} selected
          </Text>
        </View>
      )}

      <PrimaryButton
        title={canContinue ? "Continue" : "Select pet, location & 2+ dates"}
        onPress={() => router.push("/(bulk-booking)/days" as any)}
        disabled={!canContinue}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 10,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    paddingVertical: 8,
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
  selectLabel: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
  selectLabelActive: {
    color: Colors.light.onPrimary,
  },
  calendarCard: {
    padding: Spacing.sm,
  },
  pill: {
    alignSelf: "center",
    marginTop: Spacing.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primaryContainer,
  },
  pillText: {
    ...Typography.labelCaps,
    color: Colors.light.onPrimaryContainer,
  },
});
