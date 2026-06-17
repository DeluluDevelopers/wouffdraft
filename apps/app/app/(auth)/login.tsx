import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { sendOtp } from "@/lib/api";
import { Screen } from "@/ui/Screen";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function LoginScreen() {
  const router = useRouter();
  const { setPhone } = useAuth();
  const [phone, setPhoneLocal] = useState("");
  console.log("LoginScreen rendered with phone:", phone);

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: async () => {
      setPhone(phone);
      router.push({
        pathname: "/(auth)/verifyOtp",
        params: { phone },
      });
    },
    onError: (err) => {
      console.error("sendOtp failed:", err);
      const data = (err as any)?.response?.data;
      const message =
        data?.message || (err instanceof Error ? err.message : "Could not send OTP.");
      Alert.alert("Error", message);
    },
  });

  const onContinue = () => {
    if (!phone.trim()) {
      Alert.alert("Phone required", "Enter your phone number.");
      return;
    }
    mutation.mutate({ phoneNumber: phone.trim() });
  };

  return (
    <Screen>
      <View >
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to receive a one-time password.
        </Text>

        <TextField
          label="Phone number"
          placeholder="+977 98XXXXXXXX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhoneLocal}
        />

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
});
