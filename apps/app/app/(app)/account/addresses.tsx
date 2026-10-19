import { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { AddressSearch, type AddressChoice } from "@/components/address/AddressSearch";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { apiErrorMessage, createLocation, deleteLocation, type LocationProfile } from "@/lib/api";
import { useLocations } from "@/lib/queries";
import { colors, radius } from "@/theme";

export default function AddressesScreen() {
  const { accessToken, refreshProfile } = useAuth();
  const { data: locations = [], isLoading, refetch } = useLocations();
  const [adding, setAdding] = useState(false);
  const [choice, setChoice] = useState<AddressChoice | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    await Promise.all([refetch(), refreshProfile()]);
  };

  const save = useMutation({
    mutationFn: () => createLocation(accessToken!, { label: choice!.label, placeId: choice!.placeId }),
    onSuccess: async () => {
      await refresh();
      setAdding(false);
      setChoice(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteLocation(accessToken!, id),
    onSuccess: refresh,
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const confirmRemove = (location: LocationProfile) => {
    setError("");
    const message = `Remove "${location.label.split(",")[0]}"?`;
    if (Platform.OS === "web") {
      if (globalThis.confirm?.(message)) remove.mutate(location.id);
      return;
    }
    Alert.alert("Remove address", message, [
      { text: "Keep", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => remove.mutate(location.id) },
    ]);
  };

  return (
    <Screen
      header={<Header title="Saved addresses" />}
      footer={<Button title="Add address" icon="plus" onPress={() => setAdding(true)} block size="lg" />}
    >
      {error ? (
        <View style={styles.error}>
          <Text variant="bodySm" color="#7E2D22">
            {error}
          </Text>
        </View>
      ) : null}
      {isLoading ? (
        <View style={{ gap: 10, marginTop: 8 }}>
          <Skeleton height={80} />
          <Skeleton height={80} />
        </View>
      ) : locations.length === 0 ? (
        <EmptyState icon="map-pin" title="No saved addresses" text="Add the address your walker should come to." />
      ) : (
        locations.map((location) => (
          <Card key={location.id} style={styles.card}>
            <View style={styles.icon}>
              <Icon
                name={location.label === "Work" ? "building" : location.label === "Home" ? "home" : "map-pin"}
                size={20}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleSm">{location.label.split(",")[0]}</Text>
              <Text variant="bodySm" color={colors.textMuted}>
                {location.address}
              </Text>
            </View>
            <IconButton icon="trash" label="Remove address" onPress={() => confirmRemove(location)} />
          </Card>
        ))
      )}

      <BottomSheet visible={adding} onClose={() => setAdding(false)} title="Add address">
        <AddressSearch value={choice} onChange={setChoice} />
        {save.isError ? (
          <Text variant="bodySm" color={colors.danger} style={{ marginBottom: 12 }}>
            {apiErrorMessage(save.error)}
          </Text>
        ) : null}
        <Button
          title="Save address"
          onPress={() => save.mutate()}
          disabled={!choice}
          loading={save.isPending}
          block
          size="lg"
        />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  error: {
    padding: 14,
    marginTop: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.brickSoft,
  },
});
