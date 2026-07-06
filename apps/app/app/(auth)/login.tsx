import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Image, Text, View, StyleSheet, TextInput } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { sendOtp } from "@/lib/api";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

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
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/brand/wouff-mark.png")}
            style={styles.mark}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>WELCOME</Text>
        <Text style={styles.subtitle}>
          Enter your phone number and we'll send you a one-time code to sign
          in.
        </Text>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.phoneInputWrap}>
            <TextInput
              style={styles.countryCodeInput}
              value={`+${countryCode}`}
              editable={false}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.phoneInput}
              placeholder="XXXXXXXXXX"
              placeholderTextColor={Colors.light.outline}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhoneLocal(text.replace(/[^0-9]/g, ""))}
              maxLength={10}
            />
          </View>
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
    flex: 1,
    justifyContent: "center",
  },
  brandRow: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  mark: {
    width: 88,
    height: 88,
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
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  fieldWrap: {
    marginBottom: 4,
  },
  label: {
    color: Colors.light.onSurfaceVariant,
    fontSize: 12,
    fontFamily: Typography.labelCaps.fontFamily,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  phoneInputWrap: {
    flexDirection: "row",
    gap: 8,
  },
  countryCodeInput: {
    width: 72,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLow,
    color: Colors.light.ink,
    fontSize: 16,
    textAlign: "center",
    fontFamily: Typography.bodyMd.fontFamily,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: Colors.light.surfaceContainerLowest,
    color: Colors.light.ink,
    fontSize: 16,
    paddingHorizontal: 16,
    fontFamily: Typography.bodyMd.fontFamily,
  },
});
