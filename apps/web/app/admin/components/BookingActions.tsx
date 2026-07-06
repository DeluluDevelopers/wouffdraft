"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "@/admin/lib/admin-api";
import {
  ALLOWED_TRANSITIONS,
  type BookingStatusValue,
} from "@/lib/booking-status";

const ACTION_LABELS: Record<BookingStatusValue, string> = {
  PENDING: "Reopen as pending",
  CONFIRMED: "Confirm booking",
  COMPLETED: "Mark as completed",
  CANCELLED: "Cancel booking",
};

export function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: ({ next, cancellationReason }: { next: string; cancellationReason?: string }) =>
      updateBookingStatus(bookingId, next, cancellationReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
      setCancelling(false);
      setReason("");
      setError("");
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  const nextOptions = ALLOWED_TRANSITIONS[status as BookingStatusValue] ?? [];

  if (nextOptions.length === 0) {
    return (
      <div className="admin-muted">
        This booking is in a final state — no further actions available.
      </div>
    );
  }

  function startCancel() {
    setError("");
    setCancelling(true);
  }

  function confirmCancel() {
    if (!reason.trim()) {
      setError("Please provide a reason for cancelling this booking.");
      return;
    }
    mutation.mutate({ next: "CANCELLED", cancellationReason: reason.trim() });
  }

  if (cancelling) {
    return (
      <div>
        <div className="admin-label">Reason for cancellation</div>
        <textarea
          className="admin-input"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Customer requested cancellation"
          autoFocus
        />
        {error && <div className="admin-login-error" style={{ marginTop: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            className="admin-button"
            style={{ background: "var(--admin-error)" }}
            disabled={mutation.isPending}
            onClick={confirmCancel}
          >
            {mutation.isPending ? "Cancelling..." : "Confirm cancellation"}
          </button>
          <button
            className="admin-button admin-button-secondary"
            disabled={mutation.isPending}
            onClick={() => {
              setCancelling(false);
              setError("");
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="admin-login-error" style={{ marginBottom: 12 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {nextOptions.map((next) =>
          next === "CANCELLED" ? (
            <button
              key={next}
              className="admin-button admin-button-secondary"
              disabled={mutation.isPending}
              onClick={startCancel}
            >
              {ACTION_LABELS[next]}
            </button>
          ) : (
            <button
              key={next}
              className="admin-button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({ next })}
            >
              {mutation.isPending ? "Saving..." : ACTION_LABELS[next]}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
