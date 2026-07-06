import React from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { StatusBadge } from "@/ui/StatusBadge";
import { ServiceIcons } from "@/components/icons/ServiceIcons";
import { GroupSummaryCard } from "@/components/bulk-booking/GroupSummaryCard";
import { getBookings, type Booking } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";
import { getServiceAccent } from "@/constants/ServiceAccents";

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

  const ungroupedBookings = bookings.filter((b) => !b.groupId);
  const groups = new Map<string, Booking[]>();
  for (const booking of bookings) {
    if (!booking.groupId) continue;
    const list = groups.get(booking.groupId) ?? [];
    list.push(booking);
    groups.set(booking.groupId, list);
  }

  return (
    <Screen edges={["top", "left", "right"]}>
      <Text style={styles.title}>Bookings</Text>

      {isLoading ? (
        <ActivityIndicator color={Colors.light.primary} style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={ungroupedBookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={
            groups.size > 0 ? (
              <View style={styles.groupsSection}>
                <Text style={styles.groupsTitle}>Multi-day bookings</Text>
                {[...groups.entries()].map(([groupId, groupBookings]) => (
                  <GroupSummaryCard
                    key={groupId}
                    bookings={groupBookings}
                    onPress={() => router.push(`/bookings/group/${groupId}` as any)}
                  />
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const Icon = ServiceIcons[item.service] ?? ServiceIcons.Bathing;
            const accent = getServiceAccent(item.service);
            return (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/bookings/${item.id}` as any)}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconWrap, { backgroundColor: accent.bg }]}>
                    <Icon size={22} color={accent.fg} strokeWidth={1.6} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {item.service}
                    </Text>
                    <Text style={styles.petName} numberOfLines={1}>
                      {item.pet?.name}
                    </Text>
                    <Text style={styles.date} numberOfLines={1}>
                      {item.location?.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.badgeColumn}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          item.type === "Instant"
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
                            item.type === "Instant"
                              ? Colors.light.onPrimaryContainer
                              : Colors.light.onLemon,
                        },
                      ]}
                    >
                      {item.type}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.displayMd,
    color: Colors.light.ink,
    marginBottom: 20,
  },
  empty: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    textAlign: "center",
    marginTop: 40,
  },
  groupsSection: {
    marginBottom: Spacing.md,
  },
  groupsTitle: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    padding: 16,
    marginBottom: 12,
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
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  serviceName: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  petName: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
  },
  date: {
    ...Typography.bodySm,
    fontSize: 12,
    color: Colors.light.onSurfaceVariant,
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: "flex-end",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.labelBold,
    letterSpacing: 0.3,
  },
});
