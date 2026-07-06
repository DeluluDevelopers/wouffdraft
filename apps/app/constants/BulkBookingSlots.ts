export type TimeSlotKey = "morning" | "midday" | "afternoon" | "evening";

export type TimeSlot = {
  key: TimeSlotKey;
  label: string;
  hour: number;
};

export const TIME_SLOTS: TimeSlot[] = [
  { key: "morning", label: "9:00 AM", hour: 9 },
  { key: "midday", label: "12:00 PM", hour: 12 },
  { key: "afternoon", label: "3:00 PM", hour: 15 },
  { key: "evening", label: "5:30 PM", hour: 17.5 },
];

export function getTimeSlot(key: TimeSlotKey | null): TimeSlot | undefined {
  return TIME_SLOTS.find((slot) => slot.key === key);
}

export function combineDateAndSlot(dateIso: string, slotKey: TimeSlotKey): string {
  const slot = getTimeSlot(slotKey)!;
  const [year, month, day] = dateIso.split("-").map(Number);
  const hours = Math.floor(slot.hour);
  const minutes = Math.round((slot.hour - hours) * 60);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.toISOString();
}
