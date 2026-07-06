export type AdminStats = {
  userCount: number;
  petCount: number;
  bookingCount: number;
  countsByStatus: Record<string, number>;
};

export type AdminUserSummary = {
  id: string;
  name: string | null;
  phoneNumber: string;
  email: string | null;
  profileStatus: string;
  _count: { pets: number; bookings: number; location: number };
};

export type AdminPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  ageMonths: number;
  gender: string;
  vaccinationStatus: string;
};

export type AdminLocation = {
  id: string;
  label: string;
  address: string;
};

export type AdminBookingGroupSummary = { id: string; dayCount: number };

export type AdminBookingGroupSibling = {
  id: string;
  scheduledAt: string | null;
  status: string;
  service: string;
};

export type AdminBooking = {
  id: string;
  userId: string;
  status: string;
  type: string;
  service: string;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  cancellationReason: string | null;
  pet: { id: string; name: string; species: string } | null;
  location: { id: string; label: string; address: string } | null;
  user?: { id: string; name: string | null; phoneNumber: string; email: string | null };
  group?: (AdminBookingGroupSummary & { bookings?: AdminBookingGroupSibling[] }) | null;
};

export type AdminServiceOption = {
  id: string;
  service: string;
  durationMinutes: number;
  label: string;
  priceInRupees: number;
  sortOrder: number;
  isActive: boolean;
};

export type AdminUserDetail = {
  id: string;
  name: string | null;
  phoneNumber: string;
  email: string | null;
  profileStatus: string;
  location: AdminLocation[];
  pets: AdminPet[];
  bookings: AdminBooking[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data as T;
}

export function getStats() {
  return request<AdminStats>("/api/v1/admin/stats");
}

export type UsersFilter = {
  search?: string;
  profileStatus?: string;
};

export function getUsers(filter: UsersFilter = {}) {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.profileStatus) params.set("profileStatus", filter.profileStatus);
  const query = params.toString();
  return request<AdminUserSummary[]>(
    `/api/v1/admin/users${query ? `?${query}` : ""}`,
  );
}

export function getUser(id: string) {
  return request<AdminUserDetail>(`/api/v1/admin/users/${id}`);
}

export type BookingsFilter = {
  status?: string;
  service?: string;
  type?: string;
  search?: string;
};

export function getBookings(filter: BookingsFilter = {}) {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.service) params.set("service", filter.service);
  if (filter.type) params.set("type", filter.type);
  if (filter.search) params.set("search", filter.search);
  const query = params.toString();
  return request<AdminBooking[]>(
    `/api/v1/admin/bookings${query ? `?${query}` : ""}`,
  );
}

export function getBooking(id: string) {
  return request<AdminBooking>(`/api/v1/admin/bookings/${id}`);
}

export function updateBookingStatus(
  id: string,
  status: string,
  cancellationReason?: string,
) {
  return request<AdminBooking>(`/api/v1/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, cancellationReason }),
  });
}

export function getServiceOptions() {
  return request<AdminServiceOption[]>("/api/v1/admin/service-options");
}

export type CreateServiceOptionPayload = {
  service: string;
  durationMinutes: number;
  label: string;
  priceInRupees: number;
  sortOrder?: number;
};

export function createServiceOption(payload: CreateServiceOptionPayload) {
  return request<AdminServiceOption>("/api/v1/admin/service-options", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type UpdateServiceOptionPayload = Partial<{
  label: string;
  priceInRupees: number;
  durationMinutes: number;
  sortOrder: number;
  isActive: boolean;
}>;

export function updateServiceOption(id: string, payload: UpdateServiceOptionPayload) {
  return request<AdminServiceOption>(`/api/v1/admin/service-options/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
