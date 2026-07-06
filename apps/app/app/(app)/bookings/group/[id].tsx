import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { StatusBadge } from "@/ui/StatusBadge";
import { ServiceIcons } from "@/components/icons/ServiceIcons";
import { getServiceAccent } from "@/constants/ServiceAccents";
import { BookingActionSheet } from "@/components/bookings/BookingActionSheet";
import { getBookingGroup, MUTABLE_BOOKING_STATUSES, type Booking } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

export default function BookingGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [managingBooking, setManagingBooking] = useState<Booking | null>(null);

  const { data: group, isLoading } = useQuery({
    queryKey: ["booking-group", id],
    queryFn: () => getBookingGroup(accessToken!, id),
    enabled: !!accessToken && !!id,
  });

  const handleUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["booking-group", id] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  if (isLoading || !group) {
    return (
      <Screen edges={["top", "left", "right"]}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      </Screen>
    );
  }

  const sortedBookings = [...group.bookings].sort((a, b) =>
    (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""),
  );
  const activeTotal = sortedBookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + (b.priceInRupees ?? 0), 0);

  return (
    <Screen scroll edges={["top", "left", "right"]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={Colors.light.ink} />
      </Pressable>

      <Text style={styles.title}>Multi-day booking</Text>
      <Text style={styles.subtitle}>
        {group.dayCount} visits · {group.pet?.name} · {group.location?.label}
      </Text>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Remaining total</Text>
        <Text style={styles.totalValue}>₹{activeTotal}</Text>
      </View>

      {sortedBookings.map((booking) => {
        const Icon = ServiceIcons[booking.service] ?? ServiceIcons.Bathing;
        const accent = getServiceAccent(booking.service);
        const canManage = MUTABLE_BOOKING_STATUSES.includes(booking.status as any);
        return (
          <Card key={booking.id} style={styles.dayCard}>
            <View style={styles.dayRow}>
              <View style={[styles.iconWrap, { backgroundColor: accent.bg }]}>
                <Icon size={20} color={accent.fg} strokeWidth={1.6} />
              </View>
              <View style={styles.dayInfo}>
                <Text style={styles.dayService}>{booking.service}</Text>
                <Text style={styles.dayMeta}>
                  {booking.scheduledAt
                    ? new Date(booking.scheduledAt).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </Text>
              </View>
              <StatusBadge status={booking.status} />
            </View>
            {canManage && (
              <Pressable
                style={styles.manageBtn}
                onPress={() => setManagingBooking(booking)}
              >
                <Text style={styles.manageBtnText}>Manage</Text>
              </Pressable>
            )}
          </Card>
        );
      })}

      {managingBooking && accessToken && (
        <BookingActionSheet
          visible={!!managingBooking}
          onClose={() => setManagingBooking(null)}
          booking={managingBooking}
          accessToken={accessToken}
          onUpdated={handleUpdated}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    ...Typography.displayMd,
    fontSize: 26,
    color: Colors.light.ink,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    marginBottom: Spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.primaryContainer,
    borderRadius: Radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onPrimaryContainer,
  },
  totalValue: {
    ...Typography.headlineLg,
    color: Colors.light.onPrimaryContainer,
  },
  dayCard: {
    marginBottom: Spacing.sm,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
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
  manageBtn: {
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
  },
  manageBtnText: {
    ...Typography.bodySm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
});
