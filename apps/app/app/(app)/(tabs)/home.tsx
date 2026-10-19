import { Image, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { PawMark } from "@/components/brand/PawMark";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PersonAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import { Text } from "@/components/ui/Text";
import { CATEGORIES, PACK_TIERS, SUPPORT_HOURS, serviceLabel } from "@/lib/catalog";
import { firstName, greeting, km, rupees, whenLabel } from "@/lib/format";
import { splitBookings, useBookings, useServiceOptions } from "@/lib/queries";
import { colors, radius, shadow } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { data: bookings = [], isLoading, refetch, isRefetching } = useBookings();
  const { data: options = [] } = useServiceOptions();

  const { upcoming, past } = splitBookings(bookings);
  const next = upcoming[0];
  const lastReport = past.find((booking) => booking.report);
  const location = profile?.location?.[0];
  const name = firstName(profile?.name);

  const fromPrice = (services: string[]) => {
    const prices = options.filter((o) => services.includes(o.service)).map((o) => o.priceInRupees);
    return prices.length ? Math.min(...prices) : null;
  };

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {/* Location + account */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.location}
          onPress={() => router.push("/account/addresses")}
          accessibilityRole="button"
          accessibilityLabel="Change address"
        >
          <View style={styles.locationIcon}>
            <Icon name="map-pin" size={18} color={colors.terracottaInk} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.locationTitle}>
              <Text variant="titleSm" numberOfLines={1}>
                {location?.label.split(",")[0] ?? "Add an address"}
              </Text>
              <Icon name="chevron-down" size={16} />
            </View>
            {location ? (
              <Text variant="caption" color={colors.textMuted} numberOfLines={1}>
                {location.address}
              </Text>
            ) : null}
          </View>
        </Pressable>
        <Pressable onPress={() => router.push("/profile")} accessibilityRole="button" accessibilityLabel="Account">
          <PersonAvatar name={profile?.name} size={44} />
        </Pressable>
      </View>

      {/* Greeting */}
      <Text variant="headline" color={colors.terracotta} style={styles.greeting} accessibilityRole="header">
        {greeting()}
        {name ? `, ${name.toLowerCase()}` : ""}
      </Text>

      {/* Next booking */}
      {isLoading ? (
        <Skeleton height={150} style={styles.nextSkeleton} />
      ) : next ? (
        <Pressable
          onPress={() => router.push(`/booking/${next.id}`)}
          style={({ pressed }) => [styles.next, pressed && { opacity: 0.92 }]}
          accessibilityRole="button"
        >
          <View style={styles.nextHead}>
            <Text variant="label" color={colors.honey}>
              Next booking
            </Text>
            <StatusPill status={next.status} />
          </View>
          <Text variant="title" color={colors.biscuit} style={{ marginTop: 10 }}>
            {serviceLabel(next.service)} for {next.pet?.name}
          </Text>
          <Text variant="body" color="rgba(253,246,234,0.8)">
            {whenLabel(next.scheduledAt, next.type)}
          </Text>
          <View style={styles.nextFoot}>
            <View style={styles.walkerChip}>
              <Icon name={next.walker ? "user" : "search"} size={16} color={colors.charcoal} />
              <Text variant="caption" style={styles.walkerChipText}>
                {next.walker ? `Walker: ${next.walker.name}` : "Walker not assigned yet"}
              </Text>
            </View>
            <Icon name="arrow-right" size={20} color={colors.biscuit} />
          </View>
          <View style={styles.nextPaw} pointerEvents="none">
            <PawMark size={90} color="rgba(253,246,234,0.07)" />
          </View>
        </Pressable>
      ) : null}

      {/* Services */}
      <SectionTitle title="Services" />
      <View style={styles.grid}>
        {CATEGORIES.map((category) => {
          const from = fromPrice(category.services);
          return (
            <Pressable
              key={category.slug}
              onPress={() => router.push({ pathname: "/book", params: { category: category.slug } })}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              accessibilityRole="button"
              accessibilityLabel={`Book ${category.name}`}
            >
              <Image source={category.image} style={styles.tileImage} resizeMode="cover" />
              <View style={[styles.tileIcon, { backgroundColor: category.tone }]}>
                <Icon name={category.icon} size={18} />
              </View>
              <View style={styles.tileBody}>
                <Text variant="titleSm">{category.name}</Text>
                <Text variant="caption" color={colors.textMuted} numberOfLines={1}>
                  {category.short}
                </Text>
                {from != null ? (
                  <Text variant="caption" style={styles.tilePrice}>
                    from {rupees(from)}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Pack promo */}
      <Card tone="terracotta" style={styles.pack} padding={20}>
        <Text variant="title" color={colors.biscuit}>
          Walk packs
        </Text>
        <Text variant="bodySm" color={colors.biscuit} style={{ marginTop: 6, maxWidth: 250 }}>
          Book 5 or more days at the same time and save up to {PACK_TIERS[0].percent}%.
        </Text>
        <Button
          title="Plan a pack"
          variant="light"
          size="sm"
          onPress={() => router.push({ pathname: "/book", params: { category: "dog-walking", pack: "1" } })}
          style={{ marginTop: 14 }}
        />
        <View style={styles.packPaw} pointerEvents="none">
          <PawMark size={96} color="rgba(253,246,234,0.16)" />
        </View>
      </Card>

      {/* Latest report */}
      {lastReport?.report ? (
        <>
          <SectionTitle title="Last report" />
          <Card onPress={() => router.push(`/booking/${lastReport.id}`)} style={styles.report}>
            <View style={[styles.reportIcon]}>
              <Icon name="camera" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleSm">
                {serviceLabel(lastReport.service)} · {lastReport.pet?.name}
              </Text>
              <Text variant="bodySm" color={colors.textMuted}>
                {[
                  lastReport.report.distanceMeters != null ? `${km(lastReport.report.distanceMeters)} km` : null,
                  whenLabel(lastReport.scheduledAt, lastReport.type),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textSubtle} />
          </Card>
        </>
      ) : null}

      {/* Help */}
      <Card tone="muted" onPress={() => router.push("/account/help")} style={styles.help}>
        <Icon name="chat" size={22} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">Help & support</Text>
          <Text variant="caption" color={colors.textMuted}>
            {SUPPORT_HOURS}
          </Text>
        </View>
        <Icon name="chevron-right" size={18} color={colors.textSubtle} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    marginBottom: 18,
  },
  location: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greeting: {
    marginBottom: -2,
  },
  nextSkeleton: {
    marginTop: 20,
    borderRadius: radius.lg,
  },
  next: {
    marginTop: 20,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.charcoal,
    overflow: "hidden",
    ...shadow.card,
  },
  nextHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nextFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  walkerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.honey,
  },
  walkerChipText: {
    fontFamily: "Archivo-SemiBold",
  },
  nextPaw: {
    position: "absolute",
    right: -10,
    top: -12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "48%",
    flexGrow: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  tilePressed: {
    transform: [{ scale: 0.98 }],
  },
  tileImage: {
    width: "100%",
    height: 118,
  },
  tileIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tileBody: {
    padding: 12,
    gap: 2,
  },
  tilePrice: {
    marginTop: 4,
    fontFamily: "ArchivoExpanded-Bold",
  },
  pack: {
    marginTop: 24,
    overflow: "hidden",
  },
  packPaw: {
    position: "absolute",
    right: 16,
    bottom: 12,
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sage,
  },
  help: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 24,
  },
});
