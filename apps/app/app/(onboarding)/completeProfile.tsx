import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Text, View, StyleSheet } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { finishProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      finishProfile({ fullName: fullName.trim(), email: email.trim() }),
    onSuccess: () => {
      router.replace("/(app)/home");
    },
    onError: () => {
      Alert.alert("Error", "Could not complete profile.");
    },
  });

  const onSubmit = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Missing info", "Please fill all fields.");
      return;
    }
    mutation.mutate();
  };

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Complete profile</Text>
        <Text style={styles.subtitle}>
          Add the remaining details to finish your account setup.
        </Text>

        <TextField
          label="Full name"
          placeholder="Your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextField
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <PrimaryButton
          title="Save profile"
          onPress={onSubmit}
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
