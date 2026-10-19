import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { DateStrip } from "@/components/booking/DateStrip";
import { SlotGrid } from "@/components/booking/SlotGrid";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ListRow } from "@/components/ui/ListRow";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { apiErrorMessage, cancelBooking, rescheduleBooking, type Booking } from "@/lib/api";
import { FREE_CANCELLATION_HOURS } from "@/lib/catalog";
import { combine, isSlotAvailable, slotGroups } from "@/lib/slots";
import { colors, radius } from "@/theme";

type Mode = "menu" | "cancel" | "reschedule";

const REASONS = ["Change of plans", "Booked by mistake", "Pet is unwell", "Found another option"];
const ALL_SLOTS = slotGroups().flatMap((group) => group.slots);

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
  const [other, setOther] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [slotKey, setSlotKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canReschedule = booking.type === "Scheduled";
  const hoursAway = booking.scheduledAt ? (new Date(booking.scheduledAt).getTime() - Date.now()) / 3_600_000 : Infinity;
  const lateCancel = hoursAway < FREE_CANCELLATION_HOURS;

  const close = () => {
    setMode("menu");
    setReason("");
    setOther("");
    setDate(null);
    setSlotKey(null);
    setError("");
    onClose();
  };

  const run = async (action: () => Promise<Booking>) => {
    setLoading(true);
    setError("");
    try {
      const updated = await action();
      onUpdated?.(updated);
      close();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const finalReason = reason === "Other" ? other.trim() : reason;
  const slot = ALL_SLOTS.find((s) => s.key === slotKey);

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title={mode === "cancel" ? "Cancel booking" : mode === "reschedule" ? "Pick a new time" : "Manage booking"}
    >
      {mode === "menu" ? (
        <View>
          {canReschedule ? (
            <ListRow
              icon="calendar"
              title="Reschedule"
              subtitle="Move to another day or time"
              onPress={() => setMode("reschedule")}
            />
          ) : null}
          <ListRow
            icon="x"
            title="Cancel booking"
            subtitle={
              lateCancel ? "Late cancellation fee may apply" : `Free up to ${FREE_CANCELLATION_HOURS} hours before`
            }
            onPress={() => setMode("cancel")}
            danger
            last
          />
        </View>
      ) : null}

      {mode === "cancel" ? (
        <View>
          <View style={[styles.notice, lateCancel && styles.noticeWarn]}>
            <Text variant="bodySm" color={lateCancel ? "#7E2D22" : "#2D4A40"}>
              {lateCancel
                ? `This visit starts in under ${FREE_CANCELLATION_HOURS} hours, so a 50% fee may apply.`
                : "Cancelling now is free."}
            </Text>
          </View>
          <Text variant="label" color={colors.textMuted} style={styles.label}>
            Why are you cancelling?
          </Text>
          <View style={styles.reasons}>
            {[...REASONS, "Other"].map((item) => (
              <Chip key={item} label={item} selected={reason === item} onPress={() => setReason(item)} />
            ))}
          </View>
          {reason === "Other" ? (
            <TextField
              placeholder="Tell us a little more"
              value={other}
              onChangeText={setOther}
              multiline
              maxLength={300}
            />
          ) : null}
          {error ? (
            <Text variant="bodySm" color={colors.danger} style={styles.error}>
              {error}
            </Text>
          ) : null}
          <Button
            title="Cancel booking"
            variant="danger"
            onPress={() => run(() => cancelBooking(accessToken, booking.id, finalReason))}
            loading={loading}
            disabled={!finalReason}
            block
            size="lg"
          />
          <Button title="Keep booking" variant="ghost" onPress={() => setMode("menu")} block style={{ marginTop: 6 }} />
        </View>
      ) : null}

      {mode === "reschedule" ? (
        <View>
          <Text variant="label" color={colors.textMuted} style={styles.label}>
            Day
          </Text>
          <DateStrip
            selected={date ? [date] : []}
            onToggle={(key) => {
              setDate(key);
              setSlotKey(null);
            }}
          />
          <Text variant="label" color={colors.textMuted} style={[styles.label, { marginTop: 20 }]}>
            Start time
          </Text>
          <SlotGrid dateKey={date} selected={slotKey} onSelect={(s) => setSlotKey(s.key)} />
          {error ? (
            <Text variant="bodySm" color={colors.danger} style={styles.error}>
              {error}
            </Text>
          ) : null}
          <Button
            title="Confirm new time"
            onPress={() => run(() => rescheduleBooking(accessToken, booking.id, combine(date!, slot!).toISOString()))}
            loading={loading}
            disabled={!date || !slot || !isSlotAvailable(date, slot)}
            block
            size="lg"
            style={{ marginTop: 20 }}
          />
          <Button title="Back" variant="ghost" onPress={() => setMode("menu")} block style={{ marginTop: 6 }} />
        </View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
    marginBottom: 18,
  },
  noticeWarn: {
    backgroundColor: colors.brickSoft,
  },
  label: {
    marginBottom: 10,
  },
  reasons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  error: {
    marginVertical: 12,
  },
});
