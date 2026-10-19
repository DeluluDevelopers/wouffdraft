// Service catalogue shared by the API, the website and the admin. Prices live
// in the ServiceOption table; this file only describes what each service is.

export const SERVICE_VALUES = [
  "Walk",
  "HomeVisit",
  "PetSitting",
  "Bathing",
  "Cutting",
  "Hygiene",
  "BlowDry",
  "NailTrim",
  "Spa",
  "Cleaning",
] as const;

export type ServiceValue = (typeof SERVICE_VALUES)[number];

export type CategorySlug = "dog-walking" | "home-visits" | "pet-sitting" | "grooming";

export const SERVICE_LABELS: Record<ServiceValue, string> = {
  Walk: "Dog walk",
  HomeVisit: "Home visit",
  PetSitting: "Pet sitting",
  Bathing: "Bath & dry",
  Cutting: "Haircut & styling",
  Hygiene: "Hygiene trim",
  BlowDry: "Blow-dry & brush",
  NailTrim: "Nail trim",
  Spa: "Spa day",
  Cleaning: "Ear & teeth clean",
};

export const SERVICE_SUMMARIES: Record<ServiceValue, string> = {
  Walk: "A one-on-one, GPS-tracked walk with a photo report after.",
  HomeVisit: "Feeding, fresh water, play and a litter or potty check while you are out.",
  PetSitting: "A carer stays with your pet at home for a half day, full day or overnight.",
  Bathing: "Shampoo, conditioner and a towel-and-dryer finish at home.",
  Cutting: "Full breed-appropriate haircut, bath included.",
  Hygiene: "Paw pads, sanitary area and face tidy-up.",
  BlowDry: "Deep brush-out and blow-dry to bust loose undercoat.",
  NailTrim: "Clip and file, with a check of paw pads.",
  Spa: "Bath, massage, paw balm, nail trim and a fresh scent.",
  Cleaning: "Gentle ear clean and teeth brushing with pet-safe paste.",
};

export const SERVICE_CATEGORY: Record<ServiceValue, CategorySlug> = {
  Walk: "dog-walking",
  HomeVisit: "home-visits",
  PetSitting: "pet-sitting",
  Bathing: "grooming",
  Cutting: "grooming",
  Hygiene: "grooming",
  BlowDry: "grooming",
  NailTrim: "grooming",
  Spa: "grooming",
  Cleaning: "grooming",
};

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  services: ServiceValue[];
  // Which species the category serves.
  species: ("Dog" | "Cat")[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "dog-walking",
    name: "Dog walks",
    short: "Solo walks with a verified walker, tracked live.",
    services: ["Walk"],
    species: ["Dog"],
  },
  {
    slug: "home-visits",
    name: "Home visits",
    short: "Feed, play and check-ins while you're away.",
    services: ["HomeVisit"],
    species: ["Dog", "Cat"],
  },
  {
    slug: "pet-sitting",
    name: "Pet sitting",
    short: "A carer at your home, by the day or overnight.",
    services: ["PetSitting"],
    species: ["Dog", "Cat"],
  },
  {
    slug: "grooming",
    name: "Grooming at home",
    short: "Baths, trims and spa days without the salon stress.",
    services: ["Bathing", "Cutting", "Hygiene", "BlowDry", "NailTrim", "Spa", "Cleaning"],
    species: ["Dog", "Cat"],
  },
];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function serviceLabel(service: string) {
  return SERVICE_LABELS[service as ServiceValue] ?? service;
}

export function isWalkLike(service: string) {
  return service === "Walk";
}

// Multi-day packs get cheaper per visit. Applied to the pack subtotal.
export const PACK_DISCOUNTS = [
  { minDays: 22, percent: 15 },
  { minDays: 12, percent: 10 },
  { minDays: 5, percent: 5 },
] as const;

export function packDiscountPercent(dayCount: number) {
  return PACK_DISCOUNTS.find((tier) => dayCount >= tier.minDays)?.percent ?? 0;
}

export function packDiscountInRupees(subtotal: number, dayCount: number) {
  return Math.round((subtotal * packDiscountPercent(dayCount)) / 100);
}

// Bookings can start this far ahead at the earliest; walkers need time to plan.
export const MIN_LEAD_TIME_MINUTES = 120;
// Cancelling before this cut-off is free.
export const FREE_CANCELLATION_HOURS = 2;
// Daily window in which visits start (24h clock, local time).
export const SLOT_START_HOUR = 6;
export const SLOT_END_HOUR = 21;

export type ServiceOptionData = {
  id: string;
  service: ServiceValue;
  durationMinutes: number;
  label: string;
  priceInRupees: number;
  sortOrder: number;
};

// Launch price list. Seeds the ServiceOption table and is the fallback for
// marketing pages if the database can't be reached. Walk prices sit in the
// middle of the 2026 Indian market (roughly Rs 110-250 a walk).
export const DEFAULT_SERVICE_OPTIONS: Omit<ServiceOptionData, "id" | "sortOrder">[] = [
  { service: "Walk", durationMinutes: 30, label: "30 min · about 2.5 km", priceInRupees: 199 },
  { service: "Walk", durationMinutes: 45, label: "45 min · about 3.5 km", priceInRupees: 259 },
  { service: "Walk", durationMinutes: 60, label: "60 min · about 4.5 km", priceInRupees: 319 },
  { service: "HomeVisit", durationMinutes: 30, label: "30 min drop-in", priceInRupees: 299 },
  { service: "HomeVisit", durationMinutes: 60, label: "60 min visit", priceInRupees: 449 },
  { service: "PetSitting", durationMinutes: 240, label: "Half day · 4 hrs", priceInRupees: 999 },
  { service: "PetSitting", durationMinutes: 480, label: "Full day · 8 hrs", priceInRupees: 1499 },
  { service: "PetSitting", durationMinutes: 720, label: "Overnight · 12 hrs", priceInRupees: 1899 },
  // Grooming mirrors the mobile app's original hardcoded prices.
  { service: "Bathing", durationMinutes: 45, label: "30-45 min", priceInRupees: 499 },
  { service: "Cutting", durationMinutes: 60, label: "45-60 min", priceInRupees: 599 },
  { service: "Hygiene", durationMinutes: 30, label: "20-30 min", priceInRupees: 249 },
  { service: "BlowDry", durationMinutes: 30, label: "20-30 min", priceInRupees: 199 },
  { service: "NailTrim", durationMinutes: 20, label: "15-20 min", priceInRupees: 149 },
  { service: "Spa", durationMinutes: 90, label: "60-90 min", priceInRupees: 999 },
  { service: "Cleaning", durationMinutes: 60, label: "45-60 min", priceInRupees: 599 },
];

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr${hours > 1 ? "s" : ""}` : `${hours.toFixed(1)} hrs`;
}
