import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/useAuth";
import { apiErrorMessage, sendOtp } from "@/lib/api";
import { openLegal } from "@/lib/links";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { colors, radius } from "@/theme";

const COUNTRY_CODE = "91";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setPhone } = useAuth();
  const [phone, setPhoneLocal] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      setPhone(COUNTRY_CODE + phone);
      router.push({ pathname: "/(auth)/verifyOtp", params: { phone: COUNTRY_CODE + phone } });
    },
    onError: (err) => setError(apiErrorMessage(err, "We couldn't send the code. Please try again.")),
  });

  const valid = /^[6-9]\d{9}$/.test(phone);

  const onContinue = () => {
    setError("");
    if (!valid) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    mutation.mutate({ phoneNumber: COUNTRY_CODE + phone });
  };

  return (
    <Screen padded={false} edges={["left", "right", "bottom"]}>
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/photos/puppy-run.jpg")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(45,45,43,0.55)", "rgba(45,45,43,0)", "rgba(45,45,43,0.2)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroContent, { paddingTop: insets.top + 24 }]}>
          <Logo variant="primary" colour="biscuit" width={150} />
        </View>
      </View>

      <View style={styles.sheet}>
        <Text variant="headline" color={colors.terracotta}>
          every walk counts
        </Text>
        <Text variant="titleLg" style={styles.title} accessibilityRole="header">
          Log in or sign up
        </Text>
        <Text variant="body" color={colors.textMuted} style={styles.subtitle}>
          We&apos;ll send a 6-digit code to your mobile number.
        </Text>

        <TextField
          label="Mobile number"
          prefix={COUNTRY_CODE}
          placeholder="98765 43210"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChangeText={(text) => {
            setPhoneLocal(text.replace(/\D/g, ""));
            setError("");
          }}
          onSubmitEditing={onContinue}
          error={error}
          returnKeyType="next"
        />

        <Button
          title="Get OTP"
          iconRight="arrow-right"
          onPress={onContinue}
          loading={mutation.isPending}
          disabled={!valid}
          block
          size="lg"
        />

        <Text variant="caption" color={colors.textSubtle} align="center" style={styles.legal}>
          By continuing you agree to our{" "}
          <Text variant="caption" color={colors.text} style={styles.link} onPress={() => openLegal("terms")}>
            Terms
          </Text>{" "}
          and{" "}
          <Text variant="caption" color={colors.text} style={styles.link} onPress={() => openLegal("privacy")}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 300,
    backgroundColor: colors.terracotta,
  },
  heroContent: {
    alignItems: "center",
  },
  sheet: {
    flex: 1,
    marginTop: -32,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
  },
  title: {
    marginTop: 2,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  legal: {
    marginTop: 16,
  },
  link: {
    textDecorationLine: "underline",
  },
});
