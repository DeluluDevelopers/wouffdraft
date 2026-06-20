import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import Colors from "@/constants/Colors";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone: routePhone } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp, profileCompleted } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

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
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Invalid OTP. Please check the code and try again.";
      setError(message);
    },
  });

  const onVerify = () => {
    setError("");
    if (!otp.trim()) {
      Alert.alert("OTP required", "Enter the OTP sent to your phone.");
      return;
    }
    mutation.mutate();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We sent a code to {routePhone || "your phone number"}.
        </Text>

        {error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.otpInput}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
          maxLength={6}
          autoFocus
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
  container: {
    gap: 24,
  },
  title: {
    color: Colors.light.onSurface,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.01,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorWrap: {
    backgroundColor: Colors.light.errorContainer,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  errorText: {
    color: Colors.light.onErrorContainer,
    fontSize: 14,
    fontWeight: "500",
  },
  otpInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: "center",
    letterSpacing: 4,
  },
  backWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 14,
  },
});