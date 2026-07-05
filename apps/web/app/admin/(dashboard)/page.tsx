import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [userCount, bookingCount, petCount, statusGroups] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.pet.count(),
    prisma.booking.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const countsByStatus: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  for (const group of statusGroups) {
    countsByStatus[group.status] = group._count.status;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Overview</div>
          <div className="admin-page-subtitle">
            A snapshot of users and bookings across Woff.
          </div>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{userCount}</div>
          <div className="admin-stat-label">Total users</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{petCount}</div>
          <div className="admin-stat-label">Total pets</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{bookingCount}</div>
          <div className="admin-stat-label">Total bookings</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Bookings by status</div>
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{countsByStatus.PENDING}</div>
            <div className="admin-stat-label">Pending</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{countsByStatus.CONFIRMED}</div>
            <div className="admin-stat-label">Confirmed</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{countsByStatus.COMPLETED}</div>
            <div className="admin-stat-label">Completed</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{countsByStatus.CANCELLED}</div>
            <div className="admin-stat-label">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
