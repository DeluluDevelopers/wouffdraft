import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { PageTitle } from "@/components/ui/PageTitle";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import type { PetProfile } from "@/lib/api";
import { petAge } from "@/lib/format";
import { colors, radius } from "@/theme";

const VACCINE: Record<PetProfile["vaccinationStatus"], { label: string; bg: string; fg: string }> = {
  UpToDate: { label: "Vaccinated", bg: colors.mossSoft, fg: "#3C4A28" },
  Partial: { label: "Partly vaccinated", bg: colors.honeySoft, fg: "#6B4A12" },
  None: { label: "Not vaccinated", bg: colors.brickSoft, fg: "#7E2D22" },
};

export default function PetsScreen() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const pets = profile?.pets ?? [];

  return (
    <Screen onRefresh={refreshProfile} refreshing={false}>
      <PageTitle
        title="Pets"
        right={<Button title="Add pet" icon="plus" size="sm" variant="dark" onPress={() => router.push("/pet/edit")} />}
      />

      {pets.length === 0 ? (
        <EmptyState
          title="No pets yet"
          text="Add your pet before booking a visit."
          actionLabel="Add pet"
          onAction={() => router.push("/pet/edit")}
        />
      ) : (
        pets.map((pet) => {
          const vaccine = VACCINE[pet.vaccinationStatus];
          return (
            <Card key={pet.id} style={styles.card}>
              <Pressable
                onPress={() => router.push({ pathname: "/pet/edit", params: { id: pet.id } })}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${pet.name}`}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
              >
                <PetAvatar name={pet.name} species={pet.species} size={60} />
                <View style={{ flex: 1 }}>
                  <Text variant="title">{pet.name}</Text>
                  <Text variant="bodySm" color={colors.textMuted}>
                    {[pet.breed || pet.species, petAge(pet.ageMonths), pet.gender].join(" · ")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color={colors.textSubtle} />
              </Pressable>
              <View style={styles.tags}>
                <View style={[styles.tag, { backgroundColor: vaccine.bg }]}>
                  <Icon name="shield" size={13} color={vaccine.fg} strokeWidth={2.2} />
                  <Text variant="caption" color={vaccine.fg} style={styles.tagText}>
                    {vaccine.label}
                  </Text>
                </View>
                {pet.medicalConditions ? (
                  <View style={[styles.tag, { backgroundColor: colors.blushSoft }]}>
                    <Icon name="first-aid" size={13} color="#7A3B22" strokeWidth={2.2} />
                    <Text variant="caption" color="#7A3B22" style={styles.tagText}>
                      Health notes
                    </Text>
                  </View>
                ) : null}
              </View>
              <Button
                title={pet.species === "Dog" ? "Book a walk" : "Book a visit"}
                variant="outline"
                size="sm"
                onPress={() =>
                  router.push({
                    pathname: "/book",
                    params: { category: pet.species === "Dog" ? "dog-walking" : "home-visits" },
                  })
                }
                style={styles.book}
              />
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  tagText: {
    fontFamily: "Archivo-SemiBold",
  },
  book: {
    marginTop: 14,
  },
});
