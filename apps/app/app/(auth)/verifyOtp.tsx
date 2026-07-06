import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone: routePhone } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const phone = routePhone || "";
      return loginWithOtp(phone, otp.trim());
    },
    onSuccess: (profile) => {
      if (profile?.profileStatus === "PROFILE_COMPLETED") {
        router.replace("/(app)/home");
      } else {
        router.replace("/(onboarding)/completeProfile/address");
      }
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        "Invalid OTP. Please check the code and try again.";
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
    <Screen scroll>
      <View style={styles.container}>
        <Text style={styles.title}>VERIFY</Text>
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
          placeholder="• • • • • •"
          placeholderTextColor={Colors.light.outline}
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
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...Typography.displayLg,
    color: Colors.light.ink,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  errorWrap: {
    backgroundColor: Colors.light.errorContainer,
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.error,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.light.onErrorContainer,
    fontSize: 14,
    fontFamily: Typography.bodyMd.fontFamily,
  },
  otpInput: {
    height: 60,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    color: Colors.light.ink,
    fontSize: 22,
    paddingHorizontal: 16,
    textAlign: "center",
    letterSpacing: 8,
    fontFamily: Typography.headlineMd.fontFamily,
  },
  backWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: Typography.bodyMd.fontFamily,
  },
});
