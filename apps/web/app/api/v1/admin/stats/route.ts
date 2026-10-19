import { NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";

export const GET = apiHandler(async () => {
  const [
    userCount,
    petCount,
    bookingCount,
    statusGroups,
    activeWalkerCount,
    unassignedCount,
    newApplicationCount,
    newEnquiryCount,
    completedRevenue,
    ratingAverage,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.booking.count(),
    prisma.booking.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.walker.count({ where: { isActive: true } }),
    prisma.booking.count({ where: { walkerId: null, status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.walkerApplication.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.booking.aggregate({ where: { status: "COMPLETED" }, _sum: { priceInRupees: true } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: { rating: true } }),
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
    data: {
      userCount,
      petCount,
      bookingCount,
      countsByStatus,
      activeWalkerCount,
      unassignedCount,
      newApplicationCount,
      newEnquiryCount,
      completedRevenueInRupees: completedRevenue._sum.priceInRupees ?? 0,
      averageRating: ratingAverage._avg.rating,
      reviewCount: ratingAverage._count.rating,
    },
  });
});
