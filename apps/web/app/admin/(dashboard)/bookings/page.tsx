"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/admin/lib/admin-api";
import { useDebouncedValue } from "@/admin/lib/useDebouncedValue";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";
import { SearchIcon } from "@/admin/components/icons";

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
  const debouncedSearch = useDebouncedValue(search);

  const filter = { status: activeStatus, service, type, search: debouncedSearch };

  const { data: bookings, isLoading, isFetching, isError } = useQuery({
    queryKey: ["admin", "bookings", filter],
    queryFn: () => getBookings(filter),
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
              {isFetching ? " · updating…" : ""}
            </div>
          </div>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">
            <SearchIcon size={15} />
          </span>
          <input
            className="admin-search-input"
            placeholder="Search by user, pet, location..."
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
                  <th></th>
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
                    <td>
                      {booking.service}
                      {booking.group && (
                        <span className="admin-chip" style={{ marginLeft: 8 }}>
                          Multi-day · {booking.group.dayCount} days
                        </span>
                      )}
                    </td>
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
