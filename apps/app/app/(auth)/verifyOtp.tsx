import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { apiErrorMessage, sendOtp } from "@/lib/api";
import { phone as formatPhone } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { OtpInput } from "@/components/ui/OtpInput";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors, radius } from "@/theme";

const RESEND_SECONDS = 30;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone = "" } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = useMutation({
    mutationFn: (code: string) => loginWithOtp(phone, code),
    onSuccess: (profile) => {
      router.replace(
        profile?.profileStatus === "PROFILE_COMPLETED" ? "/home" : "/(onboarding)/completeProfile/address",
      );
    },
    onError: (err) => {
      setError(apiErrorMessage(err, "That code is wrong or has expired."));
      setOtp("");
    },
  });

  const resend = useMutation({
    mutationFn: () => sendOtp({ phoneNumber: phone }),
    onSuccess: () => {
      setSeconds(RESEND_SECONDS);
      setNotice("Code sent.");
      setError("");
    },
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const onChange = (value: string) => {
    setOtp(value);
    setError("");
    setNotice("");
    if (value.length === 6 && !verify.isPending) verify.mutate(value);
  };

  return (
    <Screen header={<Header />}>
      <Text variant="titleLg" style={{ marginTop: 8 }} accessibilityRole="header">
        Enter the code
      </Text>
      <View style={styles.sentRow}>
        <Text variant="body" color={colors.textMuted}>
          Sent to {formatPhone(phone)}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Text variant="bodyStrong" color={colors.terracottaInk}>
            Edit
          </Text>
        </Pressable>
      </View>

      <OtpInput value={otp} onChange={onChange} error={!!error} autoFocus />

      {error ? (
        <View style={[styles.banner, styles.bannerError]}>
          <Text variant="bodySm" color="#7E2D22">
            {error}
          </Text>
        </View>
      ) : notice ? (
        <View style={[styles.banner, styles.bannerInfo]}>
          <Text variant="bodySm" color="#2D4A40">
            {notice}
          </Text>
        </View>
      ) : null}

      {__DEV__ ? (
        <Text variant="caption" color={colors.textSubtle} style={styles.devHint}>
          Test code: 123456
        </Text>
      ) : null}

      <Button
        title="Verify"
        onPress={() => verify.mutate(otp)}
        loading={verify.isPending}
        disabled={otp.length !== 6}
        block
        size="lg"
        style={styles.verify}
      />

      <View style={styles.resendRow}>
        {seconds > 0 ? (
          <Text variant="bodySm" color={colors.textMuted}>
            Resend code in 0:{String(seconds).padStart(2, "0")}
          </Text>
        ) : (
          <Pressable onPress={() => resend.mutate()} disabled={resend.isPending} hitSlop={8} accessibilityRole="button">
            <Text variant="bodyStrong" color={colors.terracottaInk}>
              {resend.isPending ? "Sending…" : "Resend code"}
            </Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 28,
  },
  banner: {
    marginTop: 16,
    padding: 14,
    borderRadius: radius.sm,
  },
  bannerError: {
    backgroundColor: colors.brickSoft,
  },
  bannerInfo: {
    backgroundColor: colors.sageSoft,
  },
  devHint: {
    marginTop: 14,
  },
  verify: {
    marginTop: 28,
  },
  resendRow: {
    alignItems: "center",
    marginTop: 20,
  },
});
