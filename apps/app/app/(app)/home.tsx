import React from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/auth/useAuth";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { Screen } from "@/ui/Screen";

export default function HomeScreen() {
  const { profile, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    Alert.alert("Logged out", "You have been signed out.");
  };

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>
          {profile?.fullName ? `Hello, ${profile.fullName}` : "Welcome back"}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile?.phone || "-"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Profile status</Text>
          <Text style={styles.infoValue}>
            {profile?.profileCompleted ? "Completed" : "Incomplete"}
          </Text>
        </View>

        <PrimaryButton title="Logout" onPress={onLogout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#21212A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 15,
    marginBottom: 22,
  },
  infoBox: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#16161D",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#24242B",
  },
  infoLabel: {
    color: "#8B8B96",
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
