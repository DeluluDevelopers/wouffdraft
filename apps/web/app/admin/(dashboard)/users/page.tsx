"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/admin/lib/admin-api";
import { PageHeaderSkeleton, TableSkeleton } from "@/admin/components/Skeletons";

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
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
            {users.length} registered user{users.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        {users.length === 0 ? (
          <div className="admin-table-empty">No users yet.</div>
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
