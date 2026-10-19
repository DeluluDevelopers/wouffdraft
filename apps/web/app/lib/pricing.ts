import { prisma } from "./prisma";
import { DEFAULT_SERVICE_OPTIONS, type ServiceOptionData, type ServiceValue } from "./catalog";

// Active prices for server-rendered marketing pages.
export async function getPublicServiceOptions(): Promise<ServiceOptionData[]> {
  try {
    const options = await prisma.serviceOption.findMany({
      where: { isActive: true },
      orderBy: [{ service: "asc" }, { sortOrder: "asc" }],
    });
    if (options.length > 0) {
      return options.map((option) => ({
        id: option.id,
        service: option.service as ServiceValue,
        durationMinutes: option.durationMinutes,
        label: option.label,
        priceInRupees: option.priceInRupees,
        sortOrder: option.sortOrder,
      }));
    }
  } catch (error) {
    console.error("Falling back to default prices:", error);
  }
  return DEFAULT_SERVICE_OPTIONS.map((option, index) => ({
    ...option,
    id: `default-${index}`,
    sortOrder: index,
  }));
}

export function lowestPrice(options: ServiceOptionData[], services: ServiceValue[]) {
  const prices = options.filter((option) => services.includes(option.service)).map((o) => o.priceInRupees);
  return prices.length ? Math.min(...prices) : null;
}
