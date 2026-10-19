import { Alert, Platform, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useAuth } from "@/auth/useAuth";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";
import { ListRow } from "@/components/ui/ListRow";
import { PersonAvatar } from "@/components/ui/PetAvatar";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { openLegal } from "@/lib/links";
import { phone } from "@/lib/format";
import { useBookings } from "@/lib/queries";
import { colors } from "@/theme";

export default function AccountScreen() {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const { data: bookings = [] } = useBookings();
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;

  const confirmLogout = () => {
    if (Platform.OS === "web") {
      if (globalThis.confirm?.("Log out of PawMile?")) logout();
      return;
    }
    Alert.alert("Log out", "Log out of PawMile on this phone?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <Screen>
      <Card tone="dark" style={styles.hero} padding={20}>
        <View style={styles.heroRow}>
          <PersonAvatar name={profile?.name} size={60} tone={colors.terracotta} />
          <View style={{ flex: 1 }}>
            <Text variant="title" color={colors.biscuit}>
              {profile?.name ?? "Your account"}
            </Text>
            <Text variant="bodySm" color="rgba(253,246,234,0.75)">
              {phone(profile?.phoneNumber)}
            </Text>
            {profile?.email ? (
              <Text variant="bodySm" color="rgba(253,246,234,0.75)">
                {profile.email}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.stats}>
          <Stat value={profile?.pets.length ?? 0} label="pets" />
          <Stat value={completed} label="completed" />
          <Stat value={profile?.location.length ?? 0} label="addresses" />
        </View>
      </Card>

      <Text variant="label" color={colors.textMuted} style={styles.section}>
        Account
      </Text>
      <Card padding={0} style={styles.group}>
        <View style={styles.inner}>
          <ListRow
            icon="user"
            title="Your details"
            subtitle="Name and email"
            onPress={() => router.push("/account/details")}
          />
          <ListRow icon="map-pin" title="Saved addresses" onPress={() => router.push("/account/addresses")} />
          <ListRow icon="paw" title="Your pets" onPress={() => router.push("/pets")} last />
        </View>
      </Card>

      <Text variant="label" color={colors.textMuted} style={styles.section}>
        Help
      </Text>
      <Card padding={0} style={styles.group}>
        <View style={styles.inner}>
          <ListRow
            icon="chat"
            title="Help & support"
            subtitle="FAQs and contact"
            onPress={() => router.push("/account/help")}
          />
          <ListRow icon="heart" title="Become a walker" onPress={() => router.push("/account/walker")} last />
        </View>
      </Card>

      <Text variant="label" color={colors.textMuted} style={styles.section}>
        Legal
      </Text>
      <Card padding={0} style={styles.group}>
        <View style={styles.inner}>
          <ListRow icon="info" title="Terms of service" onPress={() => openLegal("terms")} />
          <ListRow icon="lock" title="Privacy policy" onPress={() => openLegal("privacy")} />
          <ListRow icon="refresh" title="Cancellation & refunds" onPress={() => openLegal("cancellation")} last />
        </View>
      </Card>

      <Card padding={0} style={[styles.group, { marginTop: 20 }]}>
        <View style={styles.inner}>
          <ListRow icon="logout" title="Log out" onPress={confirmLogout} danger last />
        </View>
      </Card>

      <View style={styles.footer}>
        <Logo variant="horizontal" width={150} />
        <Text variant="caption" color={colors.textSubtle} style={{ marginTop: 8 }}>
          Version {Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
      </View>
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
    marginTop: 12,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  stats: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(253,246,234,0.14)",
  },
  section: {
    marginTop: 24,
    marginBottom: 10,
  },
  group: {
    overflow: "hidden",
  },
  inner: {
    paddingHorizontal: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
});
