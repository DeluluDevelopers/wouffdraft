// Shared Prisma `include` shapes so every customer-facing booking response has
// the same fields. Walker phone numbers stay private; customers reach walkers
// through PawMile support.
export const publicWalkerSelect = {
  id: true,
  name: true,
  city: true,
  area: true,
  bio: true,
  photoUrl: true,
  yearsExperience: true,
  languages: true,
} as const;

export const customerBookingInclude = {
  pet: true,
  location: true,
  walker: { select: publicWalkerSelect },
  report: true,
  review: true,
  group: { select: { id: true, dayCount: true, totalPriceInRupees: true, discountInRupees: true } },
} as const;
