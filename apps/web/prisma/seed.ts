import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// Mirrors today's hardcoded values in apps/app/app/(app)/home.tsx's SERVICES
// array — seeding must replicate the status quo exactly, not invent new
// duration tiers (those are an admin-editable follow-up).
const SERVICE_OPTIONS = [
  { service: "Bathing", durationMinutes: 45, label: "30-45 min", priceInRupees: 499 },
  { service: "Cutting", durationMinutes: 60, label: "45-60 min", priceInRupees: 599 },
  { service: "Hygiene", durationMinutes: 30, label: "20-30 min", priceInRupees: 249 },
  { service: "BlowDry", durationMinutes: 30, label: "20-30 min", priceInRupees: 199 },
  { service: "NailTrim", durationMinutes: 20, label: "15-20 min", priceInRupees: 149 },
  { service: "Spa", durationMinutes: 90, label: "60-90 min", priceInRupees: 999 },
  { service: "Cleaning", durationMinutes: 60, label: "45-60 min", priceInRupees: 599 },
] as const;

async function main() {
  for (const [index, option] of SERVICE_OPTIONS.entries()) {
    await prisma.serviceOption.upsert({
      where: {
        service_durationMinutes: {
          service: option.service,
          durationMinutes: option.durationMinutes,
        },
      },
      update: {
        label: option.label,
        priceInRupees: option.priceInRupees,
        sortOrder: index,
      },
      create: {
        service: option.service,
        durationMinutes: option.durationMinutes,
        label: option.label,
        priceInRupees: option.priceInRupees,
        sortOrder: index,
      },
    });
  }
  console.log(`Seeded ${SERVICE_OPTIONS.length} service options.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
