"use client";

import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/admin/lib/admin-api";
import { StatGridSkeleton } from "@/admin/components/Skeletons";

export default function AdminOverviewPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getStats,
  });

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

      {isLoading ? (
        <StatGridSkeleton count={3} />
      ) : isError ? (
        <div className="admin-card admin-muted">Failed to load stats.</div>
      ) : (
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats!.userCount}</div>
            <div className="admin-stat-label">Total users</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats!.petCount}</div>
            <div className="admin-stat-label">Total pets</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats!.bookingCount}</div>
            <div className="admin-stat-label">Total bookings</div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-title">Bookings by status</div>
        {isLoading ? (
          <StatGridSkeleton count={4} />
        ) : isError ? (
          <div className="admin-muted">Failed to load stats.</div>
        ) : (
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {stats!.countsByStatus.PENDING ?? 0}
              </div>
              <div className="admin-stat-label">Pending</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {stats!.countsByStatus.CONFIRMED ?? 0}
              </div>
              <div className="admin-stat-label">Confirmed</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {stats!.countsByStatus.COMPLETED ?? 0}
              </div>
              <div className="admin-stat-label">Completed</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">
                {stats!.countsByStatus.CANCELLED ?? 0}
              </div>
              <div className="admin-stat-label">Cancelled</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
