import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet, TextInput } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { sendOtp } from "@/lib/api";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import Colors from "@/constants/Colors";

export default function LoginScreen() {
  const router = useRouter();
  const { setPhone } = useAuth();
  const [phone, setPhoneLocal] = useState("");
  const [countryCode, setCountryCode] = useState("91");

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: async () => {
      setPhone(phone);
      router.push({
        pathname: "/(auth)/verifyOtp",
        params: { phone: countryCode + phone },
      });
    },
    onError: (err) => {
      console.error("sendOtp failed:", err);
      const data = (err as any)?.response?.data;
      const message =
        data?.message ||
        (err instanceof Error ? err.message : "Could not send OTP.");
      Alert.alert("Error", message);
    },
  });

  const onContinue = () => {
    if (!phone.trim()) {
      Alert.alert("Phone required", "Enter your phone number.");
      return;
    }
    mutation.mutate({ phoneNumber: countryCode + phone.trim() });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to receive a one-time password.
        </Text>

        <View style={styles.phoneInputWrap}>
          <TextInput
            style={styles.countryCodeInput}
            value={countryCode}
            editable={false}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.phoneInput}
            placeholder="XXXXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhoneLocal(text.replace(/[^0-9]/g, ""))}
            maxLength={10}
          />
        </View>

        <PrimaryButton
          title="Send OTP"
          onPress={onContinue}
          loading={mutation.isPending}
        />
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
  phoneInputWrap: {
    flexDirection: "row",
    gap: 8,
  },
  countryCodeInput: {
    width: 80,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
