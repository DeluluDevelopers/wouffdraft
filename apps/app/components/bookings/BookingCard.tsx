import { StyleSheet, View } from "react-native";
import type { Booking } from "@/lib/api";
import { categoryFor, serviceLabel } from "@/lib/catalog";
import { duration, whenLabel } from "@/lib/format";
import { colors, radius } from "@/theme";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { StatusPill } from "../ui/StatusPill";
import { Text } from "../ui/Text";

export function BookingCard({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const category = categoryFor(booking.service);
  const meta = [booking.pet?.name, duration(booking.durationMinutes)].filter(Boolean).join(" · ");
  return (
    <Card
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`${serviceLabel(booking.service)}, ${whenLabel(booking.scheduledAt, booking.type)}`}
    >
      <View style={[styles.icon, { backgroundColor: category.tone }]}>
        <Icon name={category.icon} size={22} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="titleSm" style={{ flex: 1 }} numberOfLines={1}>
            {serviceLabel(booking.service)}
          </Text>
          <StatusPill status={booking.status} />
        </View>
        <Text variant="bodyStrong" style={styles.when}>
          {whenLabel(booking.scheduledAt, booking.type)}
        </Text>
        <Text variant="bodySm" color={colors.textMuted} numberOfLines={1}>
          {meta}
          {booking.walker ? ` · with ${booking.walker.name.split(" ")[0]}` : ""}
        </Text>
        {booking.group ? (
          <View style={styles.pack}>
            <Icon name="calendar" size={13} color={colors.terracottaInk} />
            <Text variant="caption" color={colors.terracottaInk} style={styles.packText}>
              Part of a {booking.group.dayCount}-day pack
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  when: {
    marginTop: 4,
  },
  pack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  packText: {
    fontFamily: "Archivo-SemiBold",
  },
});
