"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/admin/lib/admin-api";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";

const PROFILE_STATUS_VALUES = [
  "REGISTERED",
  "VERIFIED",
  "PROFILE_COMPLETED",
  "SUSPENDED",
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [profileStatus, setProfileStatus] = useState("");

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  });

  const filtered = useMemo(() => {
    if (!users) return [];
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      if (profileStatus && user.profileStatus !== profileStatus) return false;
      if (!query) return true;
      const haystack = [user.name, user.phoneNumber, user.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [users, search, profileStatus]);

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
            {filtered.length} of {users.length} registered user
            {users.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">⌕</span>
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
        {filtered.length === 0 ? (
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
              {filtered.map((user) => (
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
