import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { getBooking, type Booking } from "@/lib/api";

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Bathing: "water",
  Cutting: "cut",
  Hygiene: "shield-checkmark",
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;
    getBooking(accessToken, id as string)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Booking not found</Text>
        <PrimaryButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>

      <View style={styles.serviceSection}>
        <View style={styles.bigIconWrap}>
          <Ionicons
            name={SERVICE_ICONS[booking.service] || "ellipse"}
            size={40}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.serviceTitle}>{booking.service}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                booking.type === "Instant" ? "#1A3A2A" : "#2A2A1A",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: booking.type === "Instant" ? "#4ADE80" : "#EAB308",
              },
            ]}
          >
            {booking.type}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <DetailRow
          icon="calendar"
          label="Booked on"
          value={new Date(booking.createdAt).toLocaleDateString()}
        />
        <DetailRow
          icon="paw"
          label="Pet"
          value={booking.pet?.name || "Unknown"}
        />
        <DetailRow
          icon={
            booking.pet?.species === "Dog" ? "paw" : "paw-outline"
          }
          label="Species"
          value={booking.pet?.species || "-"}
        />
        {booking.scheduledAt && (
          <DetailRow
            icon="time"
            label="Scheduled"
            value={new Date(booking.scheduledAt).toLocaleString()}
          />
        )}
        <DetailRow
          icon="copy"
          label="Booking ID"
          value={booking.id.slice(0, 8) + "..."}
        />
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color="#666" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    color: "#A8A8B3",
    fontSize: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111118",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  serviceSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  bigIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1A1A24",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: "#111118",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#21212A",
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    color: "#A8A8B3",
    fontSize: 14,
  },
  rowValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
