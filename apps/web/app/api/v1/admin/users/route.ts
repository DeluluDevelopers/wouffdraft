import { NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";

export const GET = apiHandler(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      profileStatus: true,
      _count: {
        select: { pets: true, bookings: true, location: true },
      },
    },
    orderBy: { phoneNumber: "asc" },
  });

  return NextResponse.json({ status: 200, success: true, data: users });
});
