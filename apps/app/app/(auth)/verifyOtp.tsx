import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone: routePhone } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp, profileCompleted } = useAuth();
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const phone = routePhone || "";
      await loginWithOtp(phone, otp.trim());
    },
    onSuccess: () => {
      if (profileCompleted) {
        router.replace("/(app)/home");
      } else {
        router.replace("/(onboarding)/completeProfile/address");
      }
    },
    onError: () => {
      Alert.alert("Invalid OTP", "Please check the code and try again.");
    },
  });

  const onVerify = () => {
    if (!otp.trim()) {
      Alert.alert("OTP required", "Enter the OTP sent to your phone.");
      return;
    }
    mutation.mutate();
  };

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We sent a code to {routePhone || "your phone number"}.
        </Text>

        <TextField
          label="OTP"
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
        />

        <PrimaryButton
          title="Verify"
          onPress={onVerify}
          loading={mutation.isPending}
        />

        <TouchableOpacity onPress={() => router.back()} style={styles.backWrap}>
          <Text style={styles.backText}>Change phone number</Text>
        </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A8A8B3",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: "#D7D7DD",
    fontSize: 14,
  },
});
