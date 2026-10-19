import { useRef, useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Header } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, applyAsWalker, type WalkerApplicationPayload } from "@/lib/api";
import { colors, radius } from "@/theme";

const EXPERIENCE: { value: WalkerApplicationPayload["experience"]; label: string }[] = [
  { value: "None", label: "New to it" },
  { value: "Own pets", label: "My own pets" },
  { value: "Pet care work", label: "Cared for others' pets" },
  { value: "Professional", label: "Work with animals" },
];

const AVAILABILITY = ["Early mornings", "Mornings", "Afternoons", "Evenings", "Weekends"];

export default function BecomeWalkerScreen() {
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [area, setArea] = useState("");
  const [experience, setExperience] = useState<WalkerApplicationPayload["experience"]>("Own pets");
  const [availability, setAvailability] = useState<string[]>(["Mornings"]);
  const [hasOwnPet, setHasOwnPet] = useState<"yes" | "no">(profile?.pets.length ? "yes" : "no");
  const [about, setAbout] = useState("");
  const areaRef = useRef<TextInput>(null);

  const apply = useMutation({
    mutationFn: () =>
      applyAsWalker({
        name: name.trim(),
        phoneNumber: profile!.phoneNumber.replace(/^91/, ""),
        email: profile?.email ?? undefined,
        city: "Bengaluru",
        area: area.trim(),
        experience,
        availability,
        hasOwnPet: hasOwnPet === "yes",
        about: about.trim() || undefined,
      }),
  });

  if (apply.isSuccess) {
    return (
      <Screen header={<Header title="Become a walker" />}>
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <Icon name="check" size={36} color={colors.paper} strokeWidth={2.6} />
          </View>
          <Text variant="titleLg" align="center">
            Application sent
          </Text>
          <Text variant="body" color={colors.textMuted} align="center" style={{ marginTop: 8 }}>
            We&apos;ll call you to arrange an interview.
          </Text>
        </View>
      </Screen>
    );
  }

  const toggle = (slot: string) =>
    setAvailability((current) => (current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot]));

  return (
    <Screen
      header={<Header title="Become a walker" />}
      footer={
        <Button
          title="Send application"
          onPress={() => apply.mutate()}
          loading={apply.isPending}
          disabled={name.trim().length < 2 || !area.trim() || availability.length === 0}
          block
          size="lg"
        />
      }
    >
      <View style={styles.hero}>
        <Image source={require("@/assets/images/photos/group-walk.jpg")} style={styles.heroImage} />
      </View>
      <Text variant="body" color={colors.textMuted} style={{ marginTop: 16, marginBottom: 16 }}>
        Walk dogs in your neighbourhood. Send this form and our team will call you.
      </Text>

      <Card tone="muted" style={{ marginBottom: 20 }}>
        <Text variant="bodySm" color={colors.textMuted}>
          Before your first walk you&apos;ll need ID and address proof, police verification, an interview and a trial
          walk.
        </Text>
      </Card>

      <TextField
        label="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => areaRef.current?.focus()}
      />
      <TextField
        ref={areaRef}
        label="Your neighbourhood"
        placeholder="e.g. HSR Layout"
        value={area}
        onChangeText={setArea}
        returnKeyType="done"
      />

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Experience
      </Text>
      <View style={styles.chips}>
        {EXPERIENCE.map((item) => (
          <Chip
            key={item.value}
            label={item.label}
            selected={experience === item.value}
            onPress={() => setExperience(item.value)}
          />
        ))}
      </View>

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Availability
      </Text>
      <View style={styles.chips}>
        {AVAILABILITY.map((slot) => (
          <Chip key={slot} label={slot} selected={availability.includes(slot)} onPress={() => toggle(slot)} />
        ))}
      </View>

      <Text variant="label" color={colors.textMuted} style={styles.label}>
        Do you have a pet at home?
      </Text>
      <Segmented
        value={hasOwnPet}
        onChange={setHasOwnPet}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />
      <View style={{ height: 20 }} />
      <TextField
        label="About you (optional)"
        value={about}
        onChangeText={setAbout}
        multiline
        maxLength={2000}
        placeholder="Your experience with animals"
      />
      {apply.isError ? (
        <Text variant="bodySm" color={colors.danger}>
          {apiErrorMessage(apply.error)}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 8,
    borderRadius: radius.xl,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 190,
  },
  label: {
    marginBottom: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
  },
  done: {
    alignItems: "center",
    paddingTop: 60,
  },
  doneIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.moss,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
});
