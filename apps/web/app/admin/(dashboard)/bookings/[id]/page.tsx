"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "@/admin/lib/admin-api";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { BookingActions } from "@/admin/components/BookingActions";
import { CardSkeleton, PageHeaderSkeleton } from "@/admin/components/Skeletons";

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ["admin", "booking", id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeaderSkeleton />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={2} />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div>
        <div className="admin-page-header">
          <div className="admin-page-title">Booking not found</div>
        </div>
        <Link href="/admin/bookings" className="admin-button admin-button-secondary">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">{booking.service}</div>
          <div className="admin-page-subtitle">
            Booked {new Date(booking.createdAt).toLocaleString()}
          </div>
        </div>
        <Link href="/admin/bookings" className="admin-button admin-button-secondary">
          Back to bookings
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Status</div>
        <div style={{ marginBottom: 16 }}>
          <StatusBadge status={booking.status} />
        </div>
        <BookingActions bookingId={booking.id} status={booking.status} />
        {booking.status === "CANCELLED" && booking.cancellationReason && (
          <div style={{ marginTop: 16 }}>
            <div className="admin-detail-item-label">Cancellation reason</div>
            <div className="admin-detail-item-value">
              {booking.cancellationReason}
            </div>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Details</div>
        <div className="admin-detail-grid">
          <div>
            <div className="admin-detail-item-label">Customer</div>
            <div className="admin-detail-item-value">
              <Link href={`/admin/users/${booking.userId}`}>
                {booking.user?.name || booking.user?.phoneNumber || "—"}
              </Link>
            </div>
          </div>
          <div>
            <div className="admin-detail-item-label">Phone</div>
            <div className="admin-detail-item-value">
              {booking.user?.phoneNumber || "—"}
            </div>
          </div>
          <div>
            <div className="admin-detail-item-label">Service</div>
            <div className="admin-detail-item-value">{booking.service}</div>
          </div>
          <div>
            <div className="admin-detail-item-label">Booking type</div>
            <div className="admin-detail-item-value">{booking.type}</div>
          </div>
          <div>
            <div className="admin-detail-item-label">Pet</div>
            <div className="admin-detail-item-value">
              {booking.pet?.name || "—"}
              {booking.pet?.species ? ` (${booking.pet.species})` : ""}
            </div>
          </div>
          <div>
            <div className="admin-detail-item-label">Location</div>
            <div className="admin-detail-item-value">
              {booking.location?.label || "—"}
            </div>
          </div>
          {booking.location?.address && (
            <div>
              <div className="admin-detail-item-label">Address</div>
              <div className="admin-detail-item-value">
                {booking.location.address}
              </div>
            </div>
          )}
          {booking.scheduledAt && (
            <div>
              <div className="admin-detail-item-label">Scheduled for</div>
              <div className="admin-detail-item-value">
                {new Date(booking.scheduledAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Timeline</div>
        <div className="admin-detail-grid">
          <div>
            <div className="admin-detail-item-label">Booked on</div>
            <div className="admin-detail-item-value">
              {new Date(booking.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="admin-detail-item-label">Last updated</div>
            <div className="admin-detail-item-value">
              {new Date(booking.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
