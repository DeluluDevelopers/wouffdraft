import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingStatusSelect } from "@/admin/components/BookingStatusSelect";

const STATUS_VALUES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus =
    status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? status
      : undefined;

  const bookings = await prisma.booking.findMany({
    where: activeStatus ? { status: activeStatus as never } : {},
    include: {
      pet: true,
      location: true,
      user: { select: { id: true, name: true, phoneNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Bookings</div>
          <div className="admin-page-subtitle">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            {activeStatus ? ` · ${activeStatus}` : ""}
          </div>
        </div>
      </div>

      <div className="admin-filter-bar">
        <Link
          href="/admin/bookings"
          className={
            !activeStatus
              ? "admin-button"
              : "admin-button admin-button-secondary"
          }
        >
          All
        </Link>
        {STATUS_VALUES.map((value) => (
          <Link
            key={value}
            href={`/admin/bookings?status=${value}`}
            className={
              activeStatus === value
                ? "admin-button"
                : "admin-button admin-button-secondary"
            }
          >
            {value}
          </Link>
        ))}
      </div>

      <div className="admin-table-wrap">
        {bookings.length === 0 ? (
          <div className="admin-table-empty">No bookings found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Type</th>
                <th>Pet</th>
                <th>Location</th>
                <th>Scheduled</th>
                <th>Booked on</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <Link href={`/admin/users/${booking.userId}`}>
                      {booking.user?.name || booking.user?.phoneNumber || "—"}
                    </Link>
                  </td>
                  <td>{booking.service}</td>
                  <td>{booking.type}</td>
                  <td>{booking.pet?.name || "—"}</td>
                  <td>{booking.location?.label || "—"}</td>
                  <td>
                    {booking.scheduledAt
                      ? new Date(booking.scheduledAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <BookingStatusSelect
                      bookingId={booking.id}
                      status={booking.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
