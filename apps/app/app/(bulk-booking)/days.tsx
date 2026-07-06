import React from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { WizardStepHeader } from "@/ui/WizardStepHeader";
import { DayCard } from "@/components/bulk-booking/DayCard";
import { getServiceOptions } from "@/lib/api";
import { useBulkBookingWizard } from "@/wizard/BulkBookingWizard";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";

export default function BulkBookingDaysScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { data, updateDay, removeDay } = useBulkBookingWizard();

  const { data: serviceOptions = [] } = useQuery({
    queryKey: ["service-options"],
    queryFn: () => getServiceOptions(accessToken!),
    enabled: !!accessToken,
  });

  const canContinue =
    data.days.length >= 2 && data.days.every((day) => day.service && day.serviceOptionId && day.timeSlot);

  if (data.days.length === 0) {
    return (
      <Screen>
        <WizardStepHeader step={2} total={3} title="Plan each day" />
        <Text style={styles.emptyText}>
          No dates selected yet. Go back and pick at least 2 days.
        </Text>
        <PrimaryButton title="Back to dates" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <WizardStepHeader
        step={2}
        total={3}
        title="Plan each day"
        subtitle="Pick a service, duration, and time for every visit."
      />

      {data.days.map((day) => (
        <DayCard
          key={day.date}
          day={day}
          serviceOptions={serviceOptions}
          onUpdate={(patch) => updateDay(day.date, patch)}
          onRemove={data.days.length > 2 ? () => removeDay(day.date) : undefined}
        />
      ))}

      <PrimaryButton
        title={canContinue ? "Review booking" : "Finish configuring each day"}
        onPress={() => router.push("/(bulk-booking)/review" as any)}
        disabled={!canContinue}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 20,
  },
});
