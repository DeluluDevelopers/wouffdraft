import axios from "axios";

const api = axios.create({
  baseURL: "https://woff-app-draft-web.vercel.app/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type SendOtpPayload = {
  phoneNumber: string;
};

export type VerifyOtpPayload = {
  phoneNumber: string;
  otp: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type PetProfile = {
  id: string;
  name: string;
  species: "Dog" | "Cat";
  breed: string | null;
  ageMonths: number;
  gender: "Male" | "Female";
  vaccinationStatus: "UpToDate" | "Partial" | "None";
  medicalConditions: boolean;
  medicalHistory: string | null;
  createdAt: string;
};

export type LocationProfile = {
  id: string;
  label: string;
  placeId: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type Profile = {
  id: string;
  phoneNumber: string;
  email: string | null;
  name: string | null;
  profileStatus: string;
  location: LocationProfile | null;
  pets: PetProfile[];
};

export type CompleteProfilePayload = {
  name: string;
  label: string;
  placeId: string;
  pets: Array<{
    name: string;
    species: "Dog" | "Cat";
    breed?: string;
    ageMonths: number;
    gender: "Male" | "Female";
    vaccinationStatus: "UpToDate" | "Partial" | "None";
    medicalConditions: boolean;
    medicalHistory?: string;
  }>;
};

export type AddressPrediction = {
  description: string;
  placeId: string;
};

export async function sendOtp(payload: SendOtpPayload) {
  console.log("Sending OTP with payload:", payload);
  try {
    const res = await api.post("/auth/send-otp", payload);
    return res.data;
  } catch (err) {
    console.error("sendOtp error:", err);
    throw err;
  }
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  const res = await api.post("/auth/verify", payload);
  return res.data.data as AuthTokens;
}

export async function refreshTokens(refreshToken: string) {
  const res = await api.post("/auth/refresh", { refreshToken });
  return res.data.data as AuthTokens;
}

export async function getProfile(accessToken: string) {
  const res = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data.data as Profile;
}

export async function completeProfile(
  accessToken: string,
  payload: CompleteProfilePayload,
) {
  const res = await api.post("/profile", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

export type Booking = {
  id: string;
  userId: string;
  petId: string;
  pet: PetProfile;
  service: "Bathing" | "Cutting" | "Hygiene";
  type: "Instant" | "Scheduled";
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingPayload = {
  petId: string;
  service: "Bathing" | "Cutting" | "Hygiene";
  type: "Instant" | "Scheduled";
  scheduledAt?: string;
};

export async function createBooking(
  accessToken: string,
  payload: CreateBookingPayload,
) {
  const res = await api.post("/bookings", payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.data as Booking;
}

export async function getBookings(accessToken: string, petId?: string) {
  const params: Record<string, string> = {};
  if (petId) params.petId = petId;
  const res = await api.get("/bookings", {
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.data as Booking[];
}

export async function getBooking(accessToken: string, id: string) {
  const res = await api.get(`/bookings/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.data as Booking;
}

export async function searchAddress(input: string) {
  const res = await api.get("/address/autocomplete", {
    params: { input },
  });
  return res.data.predictions as AddressPrediction[];
}
