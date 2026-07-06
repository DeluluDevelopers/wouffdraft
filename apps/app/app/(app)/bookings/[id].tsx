import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { ServiceIcons } from "@/components/icons/ServiceIcons";
import { getBooking, MUTABLE_BOOKING_STATUSES, type Booking } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";
import { StatusBadge } from "@/ui/StatusBadge";
import { getServiceAccent } from "@/constants/ServiceAccents";
import { BookingActionSheet } from "@/components/bookings/BookingActionSheet";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [managing, setManaging] = useState(false);

  useEffect(() => {
    if (!accessToken || !id) return;
    getBooking(accessToken, id as string)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  if (loading) {
    return (
      <Screen edges={["top", "left", "right"]}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      </Screen>
    );
  }

  if (!booking) {
    return (
      <Screen edges={["top", "left", "right"]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Booking not found</Text>
          <PrimaryButton title="Go Back" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const Icon = ServiceIcons[booking.service] ?? ServiceIcons.Bathing;
  const accent = getServiceAccent(booking.service);

  return (
    <Screen edges={["top", "left", "right"]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={Colors.light.ink} />
      </Pressable>

      <View style={styles.serviceSection}>
        <View style={[styles.bigIconWrap, { backgroundColor: accent.bg }]}>
          <Icon size={36} color={accent.fg} strokeWidth={1.6} />
        </View>
        <Text style={styles.serviceTitle}>{booking.service}</Text>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  booking.type === "Instant"
                    ? Colors.light.primaryContainer
                    : Colors.light.lemon,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    booking.type === "Instant"
                      ? Colors.light.onPrimaryContainer
                      : Colors.light.onLemon,
                },
              ]}
            >
              {booking.type}
            </Text>
          </View>
          <StatusBadge status={booking.status} />
        </View>
      </View>

      <Card>
        <DetailRow
          icon="calendar"
          label="Booked on"
          value={new Date(booking.createdAt).toLocaleDateString()}
        />
        <DetailRow icon="paw" label="Pet" value={booking.pet?.name || "Unknown"} />
        <DetailRow
          icon={booking.pet?.species === "Dog" ? "paw" : "paw-outline"}
          label="Species"
          value={booking.pet?.species || "-"}
        />
        <DetailRow icon="location" label="Location" value={booking.location?.label || "-"} />
        {booking.scheduledAt && (
          <DetailRow
            icon="time"
            label="Scheduled"
            value={new Date(booking.scheduledAt).toLocaleString()}
          />
        )}
        <DetailRow icon="copy" label="Booking ID" value={booking.id.slice(0, 8) + "..."} last />
      </Card>

      {booking.status === "CANCELLED" && booking.cancellationReason && (
        <View style={styles.cancellationCard}>
          <View style={styles.cancellationHeader}>
            <Ionicons name="close-circle" size={18} color={Colors.light.error} />
            <Text style={styles.cancellationTitle}>Cancellation reason</Text>
          </View>
          <Text style={styles.cancellationText}>{booking.cancellationReason}</Text>
        </View>
      )}

      {MUTABLE_BOOKING_STATUSES.includes(booking.status as any) && (
        <PrimaryButton
          title="Manage booking"
          variant="secondary"
          onPress={() => setManaging(true)}
        />
      )}

      {accessToken && (
        <BookingActionSheet
          visible={managing}
          onClose={() => setManaging(false)}
          booking={booking}
          accessToken={accessToken}
          onUpdated={setBooking}
        />
      )}
    </Screen>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={17} color={Colors.light.onSurfaceVariant} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
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
  serviceSection: {
    alignItems: "center",
    marginBottom: 28,
    gap: 8,
  },
  bigIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    ...Typography.headlineLg,
    color: Colors.light.ink,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.labelBold,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
  rowValue: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
  cancellationCard: {
    backgroundColor: Colors.light.errorContainer,
    borderRadius: Radius.lg,
    padding: 16,
    marginTop: 16,
    gap: 6,
  },
  cancellationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancellationTitle: {
    color: Colors.light.error,
    fontSize: 14,
    fontFamily: Fonts.labelBold,
  },
  cancellationText: {
    ...Typography.bodyMd,
    color: Colors.light.onErrorContainer,
  },
});
