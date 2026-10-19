import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PawMark } from "@/components/brand/PawMark";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { serviceLabel } from "@/lib/catalog";
import { whenLabel } from "@/lib/format";
import { colors } from "@/theme";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    groupId?: string;
    service?: string;
    pet?: string;
    when?: string;
    days?: string;
  }>();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, damping: 9, stiffness: 140 }).start();
  }, [pop]);

  const days = Number(params.days ?? "1");
  const when = params.when === "asap" ? "As soon as possible" : whenLabel(params.when);

  // Replace the success screen so "back" from the booking returns to the tabs.
  const viewBooking = () => {
    if (params.groupId) router.replace(`/pack/${params.groupId}`);
    else if (params.bookingId) router.replace(`/booking/${params.bookingId}`);
    else router.replace("/bookings");
  };

  return (
    <Screen
      edges={["top", "left", "right", "bottom"]}
      footer={
        <View style={{ gap: 10 }}>
          <Button title={days > 1 ? "View your pack" : "View booking"} onPress={viewBooking} block size="lg" />
          <Button title="Back to home" variant="ghost" onPress={() => router.replace("/home")} block />
        </View>
      }
    >
      <View style={styles.center}>
        <Animated.View style={[styles.badge, { transform: [{ scale: pop }] }]}>
          <PawMark size={58} color={colors.biscuit} />
        </Animated.View>
        <Text variant="display" color={colors.terracotta} align="center" style={{ marginTop: 18 }}>
          booked!
        </Text>
        <Text variant="titleLg" align="center">
          {serviceLabel(params.service ?? "")} for {params.pet}
        </Text>
        <Text variant="body" color={colors.textMuted} align="center" style={{ marginTop: 8, maxWidth: 300 }}>
          {days > 1 ? `${days} visits, starting ${when}` : when}
        </Text>
      </View>

      <Card style={styles.next}>
        <Text variant="titleSm">What happens next</Text>
        {[
          { icon: "users" as const, text: "We assign a walker and add their details to the booking." },
          { icon: "camera" as const, text: "After the visit, the report appears in Bookings." },
          { icon: "wallet" as const, text: "Pay after each visit by UPI, card or cash." },
        ].map((item) => (
          <View key={item.text} style={styles.step}>
            <View style={styles.stepIcon}>
              <Icon name={item.icon} size={18} />
            </View>
            <Text variant="bodySm" style={{ flex: 1 }}>
              {item.text}
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingTop: 48,
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.terracotta,
    alignItems: "center",
    justifyContent: "center",
  },
  next: {
    marginTop: 32,
    gap: 14,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
});
