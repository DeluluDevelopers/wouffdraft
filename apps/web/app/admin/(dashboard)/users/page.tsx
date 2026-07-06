"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/admin/lib/admin-api";
import { useDebouncedValue } from "@/admin/lib/useDebouncedValue";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";
import { SearchIcon } from "@/admin/components/icons";

const PROFILE_STATUS_VALUES = [
  "REGISTERED",
  "VERIFIED",
  "PROFILE_COMPLETED",
  "SUSPENDED",
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const { data: users, isLoading, isFetching, isError } = useQuery({
    queryKey: ["admin", "users", { search: debouncedSearch, profileStatus }],
    queryFn: () => getUsers({ search: debouncedSearch, profileStatus }),
    placeholderData: (previous) => previous,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeaderSkeleton />
        <TableSkeleton rows={8} columns={7} />
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div>
        <div className="admin-page-header">
          <div className="admin-page-title">Users</div>
        </div>
        <div className="admin-card admin-muted">Failed to load users.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Users</div>
          <div className="admin-page-subtitle">
            {users.length} user{users.length === 1 ? "" : "s"}
            {isFetching ? " · updating…" : ""}
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">
            <SearchIcon size={15} />
          </span>
          <input
            className="admin-search-input"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-select"
          value={profileStatus}
          onChange={(e) => setProfileStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {PROFILE_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        {users.length === 0 ? (
          <div className="admin-table-empty">No users found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Pets</th>
                <th>Locations</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link href={`/admin/users/${user.id}`}>
                      {user.name || <span className="admin-muted">Unnamed</span>}
                    </Link>
                  </td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email || <span className="admin-muted">—</span>}</td>
                  <td>{user.profileStatus}</td>
                  <td>{user._count.pets}</td>
                  <td>{user._count.location}</td>
                  <td>{user._count.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
