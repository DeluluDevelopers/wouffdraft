import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/auth/useAuth";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Screen } from "@/ui/Screen";
import { Ionicons } from "@expo/vector-icons";
import { createBooking, getProfile, type PetProfile } from "@/lib/api";

const SERVICES = [
  { key: "Bathing", icon: "water", label: "Bathing" },
  { key: "Cutting", icon: "cut", label: "Cutting" },
  { key: "Hygiene", icon: "shield-checkmark", label: "Hygiene" },
] as const;

type Service = (typeof SERVICES)[number]["key"];

export default function HomeScreen() {
  const { profile, accessToken, logout } = useAuth();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (profile?.pets) setPets(profile.pets);
  }, [profile]);

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedService(null);
    });
  };

  const confirmBooking = async (petId: string) => {
    if (!selectedService || !accessToken) return;
    setLoading(true);
    try {
      await createBooking(accessToken, {
        petId,
        service: selectedService,
        type: "Instant",
      });
      Alert.alert("Booking confirmed", `${selectedService} booked!`);
      closeModal();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await logout();
    Alert.alert("Logged out", "You have been signed out.");
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {profile?.name ? `Hello, ${profile.name}` : "Welcome back"}
          </Text>
          <Text style={styles.subtitle}>What would you like to do?</Text>
        </View>
        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out" size={22} color="#A8A8B3" />
        </Pressable>
      </View>

      <View style={styles.servicesGrid}>
        {SERVICES.map((svc) => (
          <Pressable
            key={svc.key}
            style={styles.serviceCard}
            onPress={() => openServiceModal(svc.key)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={svc.icon as any} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>{svc.label}</Text>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY }] }]}
          >
            <Pressable onPress={() => {}}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>
                Select a pet for {selectedService}
              </Text>
              {pets.length === 0 ? (
                <Text style={styles.noPets}>No pets added yet.</Text>
              ) : (
                <FlatList
                  data={pets}
                  keyExtractor={(p) => p.id}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.petRow}
                      onPress={() => confirmBooking(item.id)}
                      disabled={loading}
                    >
                      <View style={styles.petInfo}>
                        <Ionicons
                          name={
                            item.species === "Dog"
                              ? "paw"
                              : "paw-outline"
                          }
                          size={22}
                          color="#FFFFFF"
                        />
                        <View style={styles.petText}>
                          <Text style={styles.petName}>{item.name}</Text>
                          <Text style={styles.petDetail}>
                            {item.species} · {item.breed || "Mixed"}
                          </Text>
                        </View>
                      </View>
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#555"
                        />
                      )}
                    </Pressable>
                  )}
                />
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 15,
  },
  logoutBtn: {
    padding: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#111118",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#21212A",
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1A1A24",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111118",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    maxHeight: Dimensions.get("window").height * 0.5,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  noPets: {
    color: "#777",
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 24,
  },
  petRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#21212A",
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  petText: {
    gap: 2,
  },
  petName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  petDetail: {
    color: "#A8A8B3",
    fontSize: 13,
  },
});
