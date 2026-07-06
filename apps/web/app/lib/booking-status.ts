export const BOOKING_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatusValue = (typeof BOOKING_STATUS_VALUES)[number];

export const ALLOWED_TRANSITIONS: Record<BookingStatusValue, BookingStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function isValidTransition(
  from: BookingStatusValue,
  to: BookingStatusValue,
): boolean {
  return from === to || ALLOWED_TRANSITIONS[from].includes(to);
}
