"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/admin/lib/admin-api";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";

const STATUS_VALUES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const SERVICE_VALUES = [
  "Bathing",
  "Cutting",
  "Hygiene",
  "BlowDry",
  "NailTrim",
  "Spa",
  "Cleaning",
];
const TYPE_VALUES = ["Instant", "Scheduled"];

export default function AdminBookingsPage() {
  const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [type, setType] = useState("");

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["admin", "bookings", activeStatus ?? "ALL"],
    queryFn: () => getBookings(activeStatus),
    placeholderData: (previous) => previous,
  });

  const filtered = useMemo(() => {
    if (!bookings) return [];
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (service && booking.service !== service) return false;
      if (type && booking.type !== type) return false;
      if (!query) return true;
      const haystack = [
        booking.user?.name,
        booking.user?.phoneNumber,
        booking.user?.email,
        booking.pet?.name,
        booking.location?.label,
        booking.service,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [bookings, search, service, type]);

  return (
    <div>
      {isLoading && !bookings ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="admin-page-header">
          <div>
            <div className="admin-page-title">Bookings</div>
            <div className="admin-page-subtitle">
              {filtered.length} booking{filtered.length === 1 ? "" : "s"}
              {activeStatus ? ` · ${activeStatus}` : ""}
            </div>
          </div>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">⌕</span>
          <input
            className="admin-search-input"
            placeholder="Search by user, pet, location, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-select"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">All services</option>
          {SERVICE_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          {TYPE_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-bar" style={{ marginBottom: 16 }}>
        <button
          className={!activeStatus ? "admin-chip admin-chip-active" : "admin-chip"}
          onClick={() => setActiveStatus(undefined)}
        >
          All
        </button>
        {STATUS_VALUES.map((value) => (
          <button
            key={value}
            className={
              activeStatus === value ? "admin-chip admin-chip-active" : "admin-chip"
            }
            onClick={() => setActiveStatus(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {isLoading && !bookings ? (
        <TableSkeleton rows={8} columns={9} />
      ) : isError || !bookings ? (
        <div className="admin-card admin-muted">Failed to load bookings.</div>
      ) : (
        <div className="admin-table-wrap">
          {filtered.length === 0 ? (
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
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
                      <StatusBadge status={booking.status} />
                    </td>
                    <td>
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="admin-button admin-button-secondary"
                      >
                        Manage
                      </Link>
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
