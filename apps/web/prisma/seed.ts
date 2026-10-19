import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { DEFAULT_SERVICE_OPTIONS } from "../app/lib/catalog";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const SERVICE_OPTIONS = DEFAULT_SERVICE_OPTIONS;

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
