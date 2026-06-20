import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import {
  getLocations,
  createLocation,
  searchAddress,
  type LocationProfile,
  type AddressPrediction,
} from "@/lib/api";
import Colors from "@/constants/Colors";

export default function LocationsScreen() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < -50) {
          closeModal();
        }
      },
    })
  ).current;

  const [locations, setLocations] = useState<LocationProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Add location modal
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
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
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
      closeModal();
    } catch {
      Alert.alert("Error", "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  });
  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const canSave = selectedPlaceId && label.trim();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Locations</Text>
        <Pressable onPress={openAddModal} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#4ADE80" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />
      ) : locations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="location-outline" size={48} color="#333" />
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
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons name="location" size={22} color="#4ADE80" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{item.label.split(",")[0]}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Add Location Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={closeModal}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: backdropOpacity, backgroundColor: "#000" },
              ]}
            />
          </Pressable>
        </View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={100}
              style={styles.keyboardAvoid}
            >
              <View style={styles.sheetContent}>
                <View style={styles.handleRow} {...panResponder.panHandlers}>
                  <View style={styles.handle} />
                  <Pressable onPress={closeModal} style={styles.closeX}>
                    <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                  </Pressable>
                </View>
                <Text style={styles.sheetTitle}>Add Location</Text>

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
                    placeholderTextColor={Colors.light.onSurfaceVariant}
                    autoFocus
                    onSubmitEditing={() => {}}
                  />
                  {searching && (
                    <ActivityIndicator
                      color={Colors.light.primary}
                      style={{ marginBottom: 8 }}
                    />
                  )}
                  {predictions.length > 0 && (
                    <View style={styles.predictions}>
                      {predictions.map((p) => (
                        <Pressable
                          key={p.placeId}
                          style={styles.predictionRow}
                          onPress={() => selectPrediction(p)}
                          pointerEvents="box-none"
                        >
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color={Colors.light.onSurfaceVariant}
                          />
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
                        placeholderTextColor={Colors.light.onSurfaceVariant}
                      />
                      <Text style={styles.selectedAddress}>{selectedAddress}</Text>
                    </>
                  ) : null}

                  <Pressable
                    style={[
                      styles.saveBtn,
                      (!canSave || saving) && styles.saveBtnDisabled,
                    ]}
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
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.sheetContent}>
              <View style={styles.handleRow}>
                <View style={styles.handle} />
                <Pressable onPress={closeModal} style={styles.closeX}>
                  <Ionicons name="close" size={22} color={Colors.light.onSurfaceVariant} />
                </Pressable>
              </View>
              <Text style={styles.sheetTitle}>Add Location</Text>

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
                  placeholderTextColor={Colors.light.onSurfaceVariant}
                  autoFocus
                  onSubmitEditing={() => {}}
                />
                {searching && (
                  <ActivityIndicator
                    color={Colors.light.primary}
                    style={{ marginBottom: 8 }}
                  />
                )}
                {predictions.length > 0 && (
                  <View style={styles.predictions}>
                    {predictions.map((p) => (
                      <Pressable
                        key={p.placeId}
                        style={styles.predictionRow}
                        onPress={() => selectPrediction(p)}
                        pointerEvents="box-none"
                      >
                        <Ionicons
                          name="location-outline"
                          size={18}
                          color={Colors.light.onSurfaceVariant}
                        />
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
                      placeholderTextColor={Colors.light.onSurfaceVariant}
                    />
                    <Text style={styles.selectedAddress}>{selectedAddress}</Text>
                  </>
                ) : null}

                <Pressable
                  style={[
                    styles.saveBtn,
                    (!canSave || saving) && styles.saveBtnDisabled,
                  ]}
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
            </View>
          )}
        </Animated.View>
      </Modal>
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
    color: Colors.light.onSurface,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.01,
  },
  addBtn: {
    padding: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: Colors.light.onSurface,
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    marginTop: 2,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 15,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.surfaceContainerLow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
  },
  emptyBtnText: {
    color: Colors.light.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get("window").height * 0.85,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: Dimensions.get("window").height * 0.75,
  },
  handleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.outlineVariant,
  },
  closeX: {
    position: "absolute",
    right: 0,
    padding: 4,
  },
  sheetTitle: {
    color: Colors.light.onSurface,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 20,
  },
  scrollArea: {
    maxHeight: Dimensions.get("window").height * 0.55,
  },
  input: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    color: Colors.light.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  fieldLabel: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  predictions: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
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
    color: Colors.light.onSurface,
    fontSize: 14,
    flex: 1,
  },
  selectedAddress: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 13,
    marginBottom: 16,
    marginTop: -4,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    height: 54,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
    shadowColor: "#0c5252",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.light.surfaceContainer,
    opacity: 0.5,
  },
  saveBtnText: {
    color: Colors.light.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
