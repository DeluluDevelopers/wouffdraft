import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/useAuth";
import { getBooking, getBookingGroup, getBookings, getLocations, getServiceOptions, type Booking } from "./api";

export function useBookings() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(accessToken!),
    enabled: !!accessToken,
  });
}

export function useBooking(id: string | undefined) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(accessToken!, id!),
    enabled: !!accessToken && !!id,
  });
}

export function useBookingGroup(id: string | undefined) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["booking-group", id],
    queryFn: () => getBookingGroup(accessToken!, id!),
    enabled: !!accessToken && !!id,
  });
}

export function useServiceOptions() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["service-options"],
    queryFn: () => getServiceOptions(accessToken!),
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLocations() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(accessToken!),
    enabled: !!accessToken,
  });
}

const ACTIVE = ["PENDING", "CONFIRMED"];

function sortTime(booking: Booking) {
  return booking.scheduledAt ? new Date(booking.scheduledAt).getTime() : new Date(booking.createdAt).getTime();
}

export function splitBookings(bookings: Booking[]) {
  const upcoming = bookings.filter((b) => ACTIVE.includes(b.status)).sort((a, b) => sortTime(a) - sortTime(b));
  const past = bookings.filter((b) => !ACTIVE.includes(b.status)).sort((a, b) => sortTime(b) - sortTime(a));
  return { upcoming, past };
}

export function isActive(booking: Booking) {
  return ACTIVE.includes(booking.status);
}
