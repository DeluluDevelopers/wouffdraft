import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/ui/Card";
import { ServiceIcons } from "@/components/icons/ServiceIcons";
import { getServiceAccent } from "@/constants/ServiceAccents";
import { DurationChipRow } from "./DurationChipRow";
import { TimeSlotChipRow } from "./TimeSlotChipRow";
import type { DayBooking } from "@/wizard/BulkBookingWizard";
import type { ServiceOption, ServiceName } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

export const ALL_SERVICES: { key: ServiceName; label: string }[] = [
  { key: "Bathing", label: "Bathing" },
  { key: "Cutting", label: "Hair Cutting" },
  { key: "Hygiene", label: "Hygiene" },
  { key: "BlowDry", label: "Blow Dry" },
  { key: "NailTrim", label: "Nail Trimming" },
  { key: "Spa", label: "Spa Treatment" },
  { key: "Cleaning", label: "Cleaning" },
];

function formatDayLabel(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function DayCard({
  day,
  serviceOptions,
  onUpdate,
  onRemove,
}: {
  day: DayBooking;
  serviceOptions: ServiceOption[];
  onUpdate: (patch: Partial<DayBooking>) => void;
  onRemove?: () => void;
}) {
  const optionsForService = day.service
    ? serviceOptions.filter((option) => option.service === day.service)
    : [];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dateLabel}>{formatDayLabel(day.date)}</Text>
        {onRemove && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionLabel}>Service</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll}>
        <View style={styles.serviceRow}>
          {ALL_SERVICES.map((svc) => {
            const Icon = ServiceIcons[svc.key];
            const accent = getServiceAccent(svc.key);
            const active = day.service === svc.key;
            return (
              <Pressable
                key={svc.key}
                style={styles.serviceOption}
                onPress={() =>
                  onUpdate({
                    service: svc.key,
                    serviceOptionId: null,
                    durationMinutes: null,
                    priceInRupees: null,
                  })
                }
              >
                <View
                  style={[
                    styles.serviceIconWrap,
                    { backgroundColor: accent.bg },
                    active && styles.serviceIconWrapActive,
                  ]}
                >
                  <Icon size={20} color={accent.fg} strokeWidth={1.6} />
                </View>
                <Text style={[styles.serviceLabel, active && styles.serviceLabelActive]}>
                  {svc.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {day.service && (
        <>
          <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Duration</Text>
          {optionsForService.length === 0 ? (
            <Text style={styles.emptyText}>No duration options available.</Text>
          ) : (
            <DurationChipRow
              options={optionsForService}
              selectedId={day.serviceOptionId}
              onSelect={(option) =>
                onUpdate({
                  serviceOptionId: option.id,
                  durationMinutes: option.durationMinutes,
                  priceInRupees: option.priceInRupees,
                })
              }
            />
          )}
        </>
      )}

      {day.serviceOptionId && (
        <>
          <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Time</Text>
          <TimeSlotChipRow
            selected={day.timeSlot}
            onSelect={(timeSlot) => onUpdate({ timeSlot })}
          />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  dateLabel: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  removeText: {
    ...Typography.bodySm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.error,
  },
  sectionLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  serviceScroll: {
    marginHorizontal: -Spacing.md,
  },
  serviceRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  serviceOption: {
    alignItems: "center",
    gap: 4,
    width: 68,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  serviceIconWrapActive: {
    borderColor: Colors.light.primary,
  },
  serviceLabel: {
    ...Typography.bodySm,
    fontSize: 11,
    color: Colors.light.onSurfaceVariant,
    textAlign: "center",
  },
  serviceLabelActive: {
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
  emptyText: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
});
