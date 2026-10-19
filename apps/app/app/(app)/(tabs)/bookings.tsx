import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { PageTitle } from "@/components/ui/PageTitle";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import type { Booking } from "@/lib/api";
import { categoryFor, serviceLabel } from "@/lib/catalog";
import { whenLabel } from "@/lib/format";
import { splitBookings, useBookings } from "@/lib/queries";
import { colors, radius } from "@/theme";

type Tab = "upcoming" | "past";

type Row = { kind: "single"; booking: Booking } | { kind: "pack"; first: Booking; remaining: number };

// Packs show once in Upcoming, as their next visit plus how many are left.
function upcomingRows(bookings: Booking[]): Row[] {
  const rows: Row[] = [];
  const seen = new Set<string>();
  for (const booking of bookings) {
    if (!booking.groupId) {
      rows.push({ kind: "single", booking });
      continue;
    }
    if (seen.has(booking.groupId)) continue;
    seen.add(booking.groupId);
    rows.push({
      kind: "pack",
      first: booking,
      remaining: bookings.filter((b) => b.groupId === booking.groupId).length,
    });
  }
  return rows;
}

export default function BookingsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const { data: bookings = [], isLoading, refetch, isRefetching } = useBookings();
  const { upcoming, past } = splitBookings(bookings);

  const rows: Row[] =
    tab === "upcoming" ? upcomingRows(upcoming) : past.map((booking) => ({ kind: "single", booking }));

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      <PageTitle title="Bookings" />
      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: "upcoming", label: `Upcoming${upcoming.length ? ` · ${upcoming.length}` : ""}` },
          { value: "past", label: "Past" },
        ]}
      />
      <View style={styles.list}>
        {isLoading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={104} />
            <Skeleton height={104} />
            <Skeleton height={104} />
          </View>
        ) : rows.length === 0 ? (
          tab === "upcoming" ? (
            <EmptyState
              icon="calendar"
              title="No upcoming bookings"
              text="Bookings you make will show here."
              actionLabel="Book a walk"
              onAction={() => router.push({ pathname: "/book", params: { category: "dog-walking" } })}
            />
          ) : (
            <EmptyState icon="calendar" title="No past bookings" text="Completed and cancelled bookings show here." />
          )
        ) : (
          rows.map((row) =>
            row.kind === "single" ? (
              <BookingCard
                key={row.booking.id}
                booking={row.booking}
                onPress={() => router.push(`/booking/${row.booking.id}`)}
              />
            ) : (
              <PackRow key={row.first.groupId} row={row} onPress={() => router.push(`/pack/${row.first.groupId}`)} />
            ),
          )
        )}
      </View>
    </Screen>
  );
}

function PackRow({ row, onPress }: { row: Extract<Row, { kind: "pack" }>; onPress: () => void }) {
  const category = categoryFor(row.first.service);
  const total = row.first.group?.dayCount ?? row.remaining;
  const done = total - row.remaining;
  return (
    <Card onPress={onPress} style={styles.pack}>
      <View style={styles.packHead}>
        <View style={[styles.packIcon, { backgroundColor: category.tone }]}>
          <Icon name="calendar" size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="titleSm">
            {total}-day {serviceLabel(row.first.service).toLowerCase()} pack
          </Text>
          <Text variant="bodySm" color={colors.textMuted}>
            {row.first.pet?.name} · next {whenLabel(row.first.scheduledAt, row.first.type).toLowerCase()}
          </Text>
        </View>
        <Icon name="chevron-right" size={18} color={colors.textSubtle} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(4, (done / total) * 100)}%` }]} />
      </View>
      <Text variant="caption" color={colors.textMuted}>
        {done} of {total} done · {row.remaining} left
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 18,
  },
  pack: {
    marginBottom: 12,
    gap: 12,
  },
  packHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  packIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.biscuit3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.moss,
  },
});
