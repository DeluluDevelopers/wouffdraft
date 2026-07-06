import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { BottomSheet } from "@/ui/BottomSheet";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { TextField } from "@/ui/TextField";
import { TimeSlotChipRow } from "@/components/bulk-booking/TimeSlotChipRow";
import { combineDateAndSlot, type TimeSlotKey } from "@/constants/BulkBookingSlots";
import { cancelBooking, rescheduleBooking, type Booking } from "@/lib/api";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { Radius, Spacing } from "@/constants/Spacing";

type Mode = "menu" | "cancel" | "reschedule";

export function BookingActionSheet({
  visible,
  onClose,
  booking,
  accessToken,
  onUpdated,
}: {
  visible: boolean;
  onClose: () => void;
  booking: Booking;
  accessToken: string;
  onUpdated?: (booking: Booking) => void;
}) {
  const [mode, setMode] = useState<Mode>("menu");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(
    booking.scheduledAt ? new Date(booking.scheduledAt) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlot, setTimeSlot] = useState<TimeSlotKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setMode("menu");
    setReason("");
    setTimeSlot(null);
    setError("");
    onClose();
  };

  const confirmCancel = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancelling this booking.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await cancelBooking(accessToken, booking.id, reason.trim());
      onUpdated?.(updated);
      close();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const confirmReschedule = async () => {
    if (!timeSlot) {
      setError("Please pick a new time.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const scheduledAt = combineDateAndSlot(date.toISOString().slice(0, 10), timeSlot);
      const updated = await rescheduleBooking(accessToken, booking.id, scheduledAt);
      onUpdated?.(updated);
      close();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={close} title="Manage booking">
      {mode === "menu" && (
        <View style={styles.menu}>
          <PrimaryButton
            title="Reschedule"
            variant="secondary"
            onPress={() => setMode("reschedule")}
          />
          <PrimaryButton
            title="Cancel booking"
            variant="ghost"
            onPress={() => setMode("cancel")}
          />
        </View>
      )}

      {mode === "cancel" && (
        <View>
          <TextField
            label="Reason for cancellation"
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Schedule conflict"
            multiline
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <PrimaryButton
            title="Confirm cancellation"
            onPress={confirmCancel}
            loading={loading}
            disabled={loading}
          />
          <PrimaryButton title="Back" variant="ghost" onPress={() => setMode("menu")} />
        </View>
      )}

      {mode === "reschedule" && (
        <View>
          <Text style={styles.sectionLabel}>New date</Text>
          <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateInputText}>
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(_event, selected) => {
                setShowDatePicker(false);
                if (selected) setDate(selected);
              }}
            />
          )}

          <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>New time</Text>
          <TimeSlotChipRow selected={timeSlot} onSelect={setTimeSlot} />

          {!!error && <Text style={styles.error}>{error}</Text>}
          <PrimaryButton
            title="Confirm reschedule"
            onPress={confirmReschedule}
            loading={loading}
            disabled={loading}
          />
          <PrimaryButton title="Back" variant="ghost" onPress={() => setMode("menu")} />
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  menu: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.labelCaps,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 10,
  },
  dateInput: {
    backgroundColor: Colors.light.surfaceContainerLowest,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateInputText: {
    ...Typography.bodyMd,
    color: Colors.light.ink,
  },
  error: {
    ...Typography.bodySm,
    color: Colors.light.error,
    marginTop: 8,
  },
});
