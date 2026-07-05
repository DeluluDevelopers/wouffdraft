import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      email: true,
      profileStatus: true,
      _count: { select: { pets: true, bookings: true, location: true } },
    },
    orderBy: { phoneNumber: "asc" },
  });

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
