import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import { Text } from "@/components/ui/Text";
import { categoryFor, serviceLabel } from "@/lib/catalog";
import { rupees, whenLabel } from "@/lib/format";
import { useBookingGroup } from "@/lib/queries";
import { colors, radius } from "@/theme";

export default function PackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group, isLoading, refetch, isRefetching } = useBookingGroup(id);

  if (isLoading) {
    return (
      <Screen header={<Header title="Pack" />}>
        <View style={{ gap: 12 }}>
          <Skeleton height={140} />
          <Skeleton height={70} />
          <Skeleton height={70} />
        </View>
      </Screen>
    );
  }

  if (!group) {
    return (
      <Screen header={<Header title="Pack" />}>
        <EmptyState icon="calendar" title="Pack not found" />
      </Screen>
    );
  }

  const bookings = [...group.bookings].sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));
  const service = bookings[0]?.service ?? "Walk";
  const category = categoryFor(service);
  const done = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const remaining = bookings.length - done - cancelled;

  return (
    <Screen header={<Header title="Pack" />} refreshing={isRefetching} onRefresh={refetch}>
      <Card tone="dark" style={styles.hero} padding={22}>
        <Text variant="label" color={colors.honey}>
          {group.dayCount}-day pack
        </Text>
        <Text variant="titleLg" color={colors.biscuit} style={{ marginTop: 8 }}>
          {serviceLabel(service)} for {group.pet?.name}
        </Text>
        <Text variant="bodySm" color="rgba(253,246,234,0.75)" style={{ marginTop: 4 }}>
          {group.location?.label.split(",")[0]} · {rupees(group.totalPriceInRupees)}
          {group.discountInRupees ? ` (saved ${rupees(group.discountInRupees)})` : ""}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(4, (done / bookings.length) * 100)}%` }]} />
        </View>
        <View style={styles.stats}>
          <Stat value={done} label="done" />
          <Stat value={remaining} label="to go" />
          <Stat value={cancelled} label="cancelled" />
        </View>
      </Card>

      <Text variant="title" style={styles.label} accessibilityRole="header">
        Visits
      </Text>
      {bookings.map((booking, index) => (
        <Card key={booking.id} onPress={() => router.push(`/booking/${booking.id}`)} style={styles.row}>
          <View
            style={[styles.index, { backgroundColor: booking.status === "COMPLETED" ? colors.moss : category.tone }]}
          >
            {booking.status === "COMPLETED" ? (
              <Icon name="check" size={16} color={colors.paper} strokeWidth={2.6} />
            ) : (
              <Text variant="titleSm">{index + 1}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">{whenLabel(booking.scheduledAt, booking.type)}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {booking.walker ? booking.walker.name : "Walker not assigned yet"}
              {booking.report ? " · Report ready" : ""}
            </Text>
          </View>
          <StatusPill status={booking.status} />
        </Card>
      ))}
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="price" color={colors.biscuit}>
        {value}
      </Text>
      <Text variant="caption" color="rgba(253,246,234,0.7)">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 8,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(253,246,234,0.15)",
    marginTop: 18,
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.honey,
  },
  stats: {
    flexDirection: "row",
    marginTop: 16,
  },
  label: {
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  index: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
