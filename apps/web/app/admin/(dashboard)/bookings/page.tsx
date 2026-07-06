"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/admin/lib/admin-api";
import { BookingStatusSelect } from "@/admin/components/BookingStatusSelect";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";

const STATUS_VALUES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AdminBookingsPage() {
  const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["admin", "bookings", activeStatus ?? "ALL"],
    queryFn: () => getBookings(activeStatus),
    placeholderData: (previous) => previous,
  });

  return (
    <div>
      {isLoading && !bookings ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="admin-page-header">
          <div>
            <div className="admin-page-title">Bookings</div>
            <div className="admin-page-subtitle">
              {bookings ? bookings.length : 0} booking
              {bookings?.length === 1 ? "" : "s"}
              {activeStatus ? ` · ${activeStatus}` : ""}
            </div>
          </div>
        </div>
      )}

      <div className="admin-filter-bar">
        <button
          className={
            !activeStatus ? "admin-button" : "admin-button admin-button-secondary"
          }
          onClick={() => setActiveStatus(undefined)}
        >
          All
        </button>
        {STATUS_VALUES.map((value) => (
          <button
            key={value}
            className={
              activeStatus === value
                ? "admin-button"
                : "admin-button admin-button-secondary"
            }
            onClick={() => setActiveStatus(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {isLoading && !bookings ? (
        <TableSkeleton rows={8} columns={8} />
      ) : isError || !bookings ? (
        <div className="admin-card admin-muted">Failed to load bookings.</div>
      ) : (
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
      )}
    </div>
  );
}
