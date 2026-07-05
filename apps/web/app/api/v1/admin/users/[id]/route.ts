import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";

export const GET = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      profileStatus: true,
      location: true,
      pets: true,
      bookings: {
        include: { pet: true, location: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return NextResponse.json({ status: 200, success: true, data: user });
});
