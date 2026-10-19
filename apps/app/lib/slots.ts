import { MIN_LEAD_MINUTES } from "./catalog";

export const SLOT_START_HOUR = 6;
export const SLOT_END_HOUR = 21;

export type Slot = { key: string; hour: number; minute: number; label: string };
export type SlotGroup = { title: string; slots: Slot[] };

function label(hour: number, minute: number) {
  const suffix = hour < 12 ? "am" : "pm";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

// Half-hour starts from 6:00 am to 9:00 pm, grouped for the picker.
export function slotGroups(): SlotGroup[] {
  const groups: SlotGroup[] = [
    { title: "Morning", slots: [] },
    { title: "Afternoon", slots: [] },
    { title: "Evening", slots: [] },
  ];
  for (let hour = SLOT_START_HOUR; hour <= SLOT_END_HOUR; hour++) {
    for (const minute of [0, 30]) {
      if (hour === SLOT_END_HOUR && minute > 0) continue;
      const slot = { key: `${hour}:${minute}`, hour, minute, label: label(hour, minute) };
      const group = hour < 12 ? groups[0]! : hour < 17 ? groups[1]! : groups[2]!;
      group.slots.push(slot);
    }
  }
  return groups;
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

export function combine(dateKeyValue: string, slot: Pick<Slot, "hour" | "minute">) {
  const date = fromDateKey(dateKeyValue);
  date.setHours(slot.hour, slot.minute, 0, 0);
  return date;
}

export function isSlotAvailable(dateKeyValue: string, slot: Slot, now = new Date()) {
  return combine(dateKeyValue, slot).getTime() >= now.getTime() + MIN_LEAD_MINUTES * 60 * 1000;
}

export function upcomingDays(count = 21, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(from);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + i);
    return date;
  });
}
