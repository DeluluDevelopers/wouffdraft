import { NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";

export const GET = apiHandler(async () => {
  const [userCount, petCount, bookingCount, statusGroups] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.booking.count(),
    prisma.booking.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const countsByStatus: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  for (const group of statusGroups) {
    countsByStatus[group.status] = group._count.status;
  }

  return NextResponse.json({
    status: 200,
    success: true,
    data: { userCount, petCount, bookingCount, countsByStatus },
  });
});
