import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import { getBookings, type Booking } from "@/lib/api";

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Bathing: "water",
  Cutting: "cut",
  Hygiene: "shield-checkmark",
};

export default function BookingsScreen() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    getBookings(accessToken)
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <Screen>
      <Text style={styles.title}>Bookings</Text>

      {loading ? (
        <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/bookings/${item.id}` as any)}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={SERVICE_ICONS[item.service] || "ellipse"}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.petName}>{item.pet?.name}</Text>
                  <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.type === "Instant" ? "#1A3A2A" : "#2A2A1A",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        item.type === "Instant" ? "#4ADE80" : "#EAB308",
                    },
                  ]}
                >
                  {item.type}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  empty: {
    color: "#777",
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111118",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#21212A",
    padding: 16,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A1A24",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    gap: 2,
  },
  serviceName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  petName: {
    color: "#A8A8B3",
    fontSize: 13,
  },
  date: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
