"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "@/admin/lib/admin-api";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export function BookingStatusSelect({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (next: string) => updateBookingStatus(bookingId, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
  });

  function handleChange(next: string) {
    mutation.mutate(next, { onError: () => mutation.reset() });
  }

  return (
    <select
      className="admin-select"
      value={mutation.isPending ? mutation.variables : status}
      disabled={mutation.isPending}
      onChange={(e) => handleChange(e.target.value)}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
