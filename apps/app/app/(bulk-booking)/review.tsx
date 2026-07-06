import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { ServiceIcons } from "@/components/icons/ServiceIcons";
import { getServiceAccent } from "@/constants/ServiceAccents";
import { getTimeSlot, combineDateAndSlot } from "@/constants/BulkBookingSlots";
import { createBulkBooking } from "@/lib/api";
import { useBulkBookingWizard } from "@/wizard/BulkBookingWizard";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

function formatDayLabel(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function BulkBookingReviewScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { data, reset } = useBulkBookingWizard();
  const [loading, setLoading] = useState(false);

  const total = data.days.reduce((sum, day) => sum + (day.priceInRupees ?? 0), 0);
  const isComplete =
    !!data.petId &&
    !!data.locationId &&
    data.days.length >= 2 &&
    data.days.every((day) => day.service && day.serviceOptionId && day.timeSlot);

  const confirm = async () => {
    if (!accessToken || !data.petId || !data.locationId || !isComplete) return;
    setLoading(true);
    try {
      const result = await createBulkBooking(accessToken, {
        petId: data.petId,
        locationId: data.locationId,
        days: data.days.map((day) => ({
          scheduledAt: combineDateAndSlot(day.date, day.timeSlot!),
          service: day.service!,
          serviceOptionId: day.serviceOptionId!,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      const groupId = result.group.id;
      reset();
      router.replace(`/bookings/group/${groupId}` as any);
    } catch (err: any) {
      Alert.alert("Booking failed", err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <WizardStepHeader
          step={3}
          total={3}
          title="Review & confirm"
          subtitle={`${data.days.length} visits scheduled`}
        />

        {data.days.map((day) => {
          const Icon = day.service ? ServiceIcons[day.service] : ServiceIcons.Bathing;
          const accent = getServiceAccent(day.service ?? "Bathing");
          const slot = getTimeSlot(day.timeSlot);
          return (
            <Card key={day.date} style={styles.dayCard}>
              <View style={[styles.iconWrap, { backgroundColor: accent.bg }]}>
                <Icon size={22} color={accent.fg} strokeWidth={1.6} />
              </View>
              <View style={styles.dayInfo}>
                <Text style={styles.dayService}>{day.service}</Text>
                <Text style={styles.dayMeta}>
                  {formatDayLabel(day.date)}
                  {slot ? ` · ${slot.label}` : ""}
                </Text>
              </View>
              <Text style={styles.dayPrice}>₹{day.priceInRupees ?? 0}</Text>
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
        <PrimaryButton
          title={isComplete ? "Confirm booking" : "Finish configuring each day"}
          onPress={confirm}
          loading={loading}
          disabled={loading || !isComplete}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInfo: {
    flex: 1,
    gap: 2,
  },
  dayService: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  dayMeta: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  dayPrice: {
    ...Typography.headlineMd,
    fontSize: 16,
    color: Colors.light.primary,
  },
  footer: {
    padding: 20,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.background,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  totalLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
  },
  totalValue: {
    ...Typography.displayMd,
    fontSize: 24,
    color: Colors.light.ink,
  },
});
