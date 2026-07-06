"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/admin/lib/admin-api";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { CardSkeleton, PageHeaderSkeleton } from "@/admin/components/Skeletons";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeaderSkeleton />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
        <CardSkeleton lines={3} />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div>
        <div className="admin-page-header">
          <div className="admin-page-title">User not found</div>
        </div>
        <Link href="/admin/users" className="admin-button admin-button-secondary">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">
            {user.name || "Unnamed user"}
          </div>
          <div className="admin-page-subtitle">
            {user.phoneNumber}
            {user.email ? ` · ${user.email}` : ""}
          </div>
        </div>
        <Link href="/admin/users" className="admin-button admin-button-secondary">
          Back to users
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Profile</div>
        <div className="admin-detail-grid">
          <div>
            <div className="admin-detail-item-label">Profile status</div>
            <div className="admin-detail-item-value">{user.profileStatus}</div>
          </div>
          <div>
            <div className="admin-detail-item-label">Phone number</div>
            <div className="admin-detail-item-value">{user.phoneNumber}</div>
          </div>
          <div>
            <div className="admin-detail-item-label">Email</div>
            <div className="admin-detail-item-value">{user.email || "—"}</div>
          </div>
          <div>
            <div className="admin-detail-item-label">User ID</div>
            <div className="admin-detail-item-value">{user.id}</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Pets ({user.pets.length})</div>
        {user.pets.length === 0 ? (
          <div className="admin-muted">No pets added.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age (months)</th>
                  <th>Gender</th>
                  <th>Vaccination</th>
                </tr>
              </thead>
              <tbody>
                {user.pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.breed || "—"}</td>
                    <td>{pet.ageMonths}</td>
                    <td>{pet.gender}</td>
                    <td>{pet.vaccinationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Locations ({user.location.length})</div>
        {user.location.length === 0 ? (
          <div className="admin-muted">No locations saved.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {user.location.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.label}</td>
                    <td>{loc.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Bookings ({user.bookings.length})</div>
        {user.bookings.length === 0 ? (
          <div className="admin-muted">No bookings yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Type</th>
                  <th>Pet</th>
                  <th>Location</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Booked on</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {user.bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.service}</td>
                    <td>{booking.type}</td>
                    <td>{booking.pet?.name || "—"}</td>
                    <td>{booking.location?.label || "—"}</td>
                    <td>
                      {booking.scheduledAt
                        ? new Date(booking.scheduledAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
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
          </div>
        )}
      </div>
    </div>
  );
}
