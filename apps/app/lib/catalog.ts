import type { ImageSourcePropType } from "react-native";
import type { IconName } from "@/components/ui/Icon";
import type { ServiceName } from "./api";
import { colors } from "@/theme";

// Mirrors apps/web/app/lib/catalog.ts (no shared package bridges the two
// apps yet); prices always come from the API.

export type CategorySlug = "dog-walking" | "home-visits" | "pet-sitting" | "grooming";

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  services: ServiceName[];
  species: ("Dog" | "Cat")[];
  icon: IconName;
  tone: string;
  image: ImageSourcePropType;
  includes: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "dog-walking",
    name: "Dog walk",
    short: "30, 45 or 60 minutes",
    description:
      "A one-on-one walk with a vetted walker. After the walk you get the route, distance, toilet breaks and a photo.",
    services: ["Walk"],
    species: ["Dog"],
    icon: "footprints",
    tone: colors.honey,
    image: require("@/assets/images/photos/walk.jpg"),
    includes: ["Walk report with route map", "Water and paw wipe after", "Always on a leash"],
  },
  {
    slug: "home-visits",
    name: "Home visit",
    short: "30 or 60 minutes",
    description: "A carer visits to feed your pet, refill water, clean the litter or take them out, and play.",
    services: ["HomeVisit"],
    species: ["Dog", "Cat"],
    icon: "home",
    tone: colors.sage,
    image: require("@/assets/images/photos/home-visit.jpg"),
    includes: ["Feeding", "Litter or toilet break", "Medicines", "Visit report"],
  },
  {
    slug: "pet-sitting",
    name: "Pet sitting",
    short: "4, 8 or 12 hours",
    description:
      "A carer stays at your home and follows your pet's routine. Choose half a day, a full day or overnight.",
    services: ["PetSitting"],
    species: ["Dog", "Cat"],
    icon: "heart",
    tone: colors.blush,
    image: require("@/assets/images/photos/sitting.jpg"),
    includes: ["Walks and toilet breaks", "Meals and medicines", "Visit report"],
  },
  {
    slug: "grooming",
    name: "Grooming",
    short: "Bath, haircut, nails",
    description: "Grooming in your bathroom. The groomer brings the tools and products and cleans up afterwards.",
    services: ["Bathing", "Cutting", "Hygiene", "BlowDry", "NailTrim", "Spa", "Cleaning"],
    species: ["Dog", "Cat"],
    icon: "scissors",
    tone: colors.moss,
    image: require("@/assets/images/photos/grooming.jpg"),
    includes: ["Tools and products included", "Bathroom cleaned after"],
  },
];

export const SERVICE_LABELS: Record<ServiceName, string> = {
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

export const SERVICE_SUMMARIES: Record<ServiceName, string> = {
  Walk: "One-on-one walk with a report after.",
  HomeVisit: "Feeding, water, play and a litter or toilet check.",
  PetSitting: "A carer stays with your pet at home.",
  Bathing: "Shampoo, conditioner and a towel-and-dryer finish.",
  Cutting: "Full breed-appropriate haircut, bath included.",
  Hygiene: "Paw pads, sanitary area and face trim.",
  BlowDry: "Brush-out and blow-dry.",
  NailTrim: "Clip and file.",
  Spa: "Bath, massage, paw balm and nail trim.",
  Cleaning: "Gentle ear clean and teeth brushing.",
};

export const GROOMING_IMAGES: Partial<Record<ServiceName, ImageSourcePropType>> = {
  Bathing: require("@/assets/images/services/bathing.jpg"),
  Cutting: require("@/assets/images/services/cutting.jpg"),
  Hygiene: require("@/assets/images/services/hygiene.jpg"),
  BlowDry: require("@/assets/images/services/blowdry.jpg"),
  NailTrim: require("@/assets/images/services/nailtrim.jpg"),
  Spa: require("@/assets/images/services/spa.jpg"),
  Cleaning: require("@/assets/images/services/cleaning.jpg"),
};

export function categoryFor(service: ServiceName | string): Category {
  return CATEGORIES.find((category) => category.services.includes(service as ServiceName)) ?? CATEGORIES[3]!;
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function serviceLabel(service: string) {
  return SERVICE_LABELS[service as ServiceName] ?? service;
}

// Multi-day packs: same tiers the API applies.
export const PACK_TIERS = [
  { minDays: 22, percent: 15 },
  { minDays: 12, percent: 10 },
  { minDays: 5, percent: 5 },
] as const;

export function packDiscountPercent(days: number) {
  return PACK_TIERS.find((tier) => days >= tier.minDays)?.percent ?? 0;
}

export function nextPackTier(days: number) {
  return [...PACK_TIERS].reverse().find((tier) => days < tier.minDays);
}

export const FREE_CANCELLATION_HOURS = 2;
export const MIN_LEAD_MINUTES = 120;
export const SUPPORT_EMAIL = "hello@pawmile.in";
export const SUPPORT_HOURS = "Every day, 7 am – 9 pm";
