import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import { getBookings } from "@/lib/api";
import Colors from "@/constants/Colors";

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Bathing: "water",
  Cutting: "cut",
  Hygiene: "shield-checkmark",
};

export default function BookingsScreen() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const {
    data: bookings = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(accessToken!),
    enabled: !!accessToken,
  });

  return (
    <Screen>
      <Text style={styles.title}>Bookings</Text>

      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefetching}
          onRefresh={refetch}
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
                  <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
                  <Text style={styles.petName} numberOfLines={1}>{item.pet?.name}</Text>
                  <Text style={styles.date} numberOfLines={1}>
                    {item.location?.label}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.type === "Instant" ? Colors.light.primaryContainer : Colors.light.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        item.type === "Instant" ? Colors.light.onPrimary : Colors.light.warning,
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
    color: Colors.light.onSurface,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 20,
  },
  empty: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  serviceName: {
    color: Colors.light.onSurface,
    fontSize: 16,
    fontWeight: "600",
  },
  petName: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
  },
  date: {
    color: Colors.light.onSurfaceVariant,
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
