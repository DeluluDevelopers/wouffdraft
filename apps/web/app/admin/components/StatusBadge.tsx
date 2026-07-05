const STATUS_CLASS: Record<string, string> = {
  PENDING: "admin-badge admin-badge-pending",
  CONFIRMED: "admin-badge admin-badge-confirmed",
  COMPLETED: "admin-badge admin-badge-completed",
  CANCELLED: "admin-badge admin-badge-cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={STATUS_CLASS[status] || "admin-badge admin-badge-neutral"}>
      {status}
    </span>
  );
}
