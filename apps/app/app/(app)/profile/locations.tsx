import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Card } from "@/ui/Card";
import { BottomSheet } from "@/ui/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import {
  getLocations,
  createLocation,
  searchAddress,
  type LocationProfile,
  type AddressPrediction,
} from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography, { Fonts } from "@/constants/Typography";
import { Radius } from "@/constants/Spacing";

export default function LocationsScreen() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [locations, setLocations] = useState<LocationProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [label, setLabel] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    getLocations(accessToken)
      .then(setLocations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    if (!query.trim() || query.length < 3 || selectedAddress) {
      setPredictions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddress(query);
        setPredictions(results);
      } catch {
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, selectedAddress]);

  const openAddModal = () => {
    setQuery("");
    setPredictions([]);
    setSelectedPlaceId(null);
    setSelectedAddress("");
    setLabel("");
    setModalVisible(true);
  };

  const selectPrediction = (prediction: AddressPrediction) => {
    setSelectedPlaceId(prediction.placeId);
    setSelectedAddress(prediction.description);
    setQuery(prediction.description);
    setPredictions([]);
    if (!label) {
      setLabel(prediction.description.split(",")[0]);
    }
  };

  const saveLocation = async () => {
    if (!accessToken || !selectedPlaceId || !label.trim()) return;
    setSaving(true);
    try {
      await createLocation(accessToken, {
        label: label.trim(),
        placeId: selectedPlaceId,
      });
      const updated = await getLocations(accessToken);
      setLocations(updated);
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const canSave = !!(selectedPlaceId && label.trim());

  return (
    <Screen edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.ink} />
        </Pressable>
        <Text style={styles.title}>Locations</Text>
        <Pressable onPress={openAddModal} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.light.primary} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.light.primary} style={{ marginTop: 40 }} />
      ) : locations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="location-outline" size={48} color={Colors.light.outline} />
          <Text style={styles.emptyText}>No locations saved.</Text>
          <Pressable onPress={openAddModal} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Add Location</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name="location" size={20} color={Colors.light.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label.split(",")[0]}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </Card>
          )}
        />
      )}

      <BottomSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Add Location"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollArea}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.fieldLabel}>Search address</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setSelectedPlaceId(null);
              setSelectedAddress("");
            }}
            placeholder="Type your address..."
            placeholderTextColor={Colors.light.outline}
            autoFocus
          />
          {searching && (
            <ActivityIndicator color={Colors.light.primary} style={{ marginBottom: 8 }} />
          )}
          {predictions.length > 0 && (
            <View style={styles.predictions}>
              {predictions.map((p) => (
                <Pressable
                  key={p.placeId}
                  style={styles.predictionRow}
                  onPress={() => selectPrediction(p)}
                >
                  <Ionicons name="location-outline" size={18} color={Colors.light.onSurfaceVariant} />
                  <Text style={styles.predictionText}>{p.description}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {selectedAddress ? (
            <>
              <Text style={styles.fieldLabel}>Label</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder="e.g. Home, Office"
                placeholderTextColor={Colors.light.outline}
              />
              <Text style={styles.selectedAddress}>{selectedAddress}</Text>
            </>
          ) : null}

          <Pressable
            style={[styles.saveBtn, (!canSave || saving) && styles.saveBtnDisabled]}
            onPress={saveLocation}
            disabled={!canSave || saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.light.onPrimary} />
            ) : (
              <Text style={styles.saveBtnText}>Save Location</Text>
            )}
          </Pressable>
        </ScrollView>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.light.ink,
  },
  addBtn: {
    padding: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...Typography.titleMd,
    color: Colors.light.ink,
  },
  address: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
    marginTop: 2,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.surfaceContainerLowest,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
  },
  emptyBtnText: {
    ...Typography.bodyMd,
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.ink,
  },
  scrollArea: {
    maxHeight: 520,
  },
  input: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    color: Colors.light.ink,
    fontSize: 16,
    fontFamily: Fonts.body,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  fieldLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 8,
  },
  predictions: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    maxHeight: 200,
    marginBottom: 12,
    overflow: "hidden",
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  predictionText: {
    ...Typography.bodyMd,
    color: Colors.light.ink,
    flex: 1,
  },
  selectedAddress: {
    ...Typography.bodySm,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 16,
    marginTop: -4,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
  saveBtnText: {
    ...Typography.labelCaps,
    fontSize: 14,
    color: Colors.light.onPrimary,
  },
});
