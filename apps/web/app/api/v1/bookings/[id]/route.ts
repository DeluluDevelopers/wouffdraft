import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { NotFoundError } from "../../../../lib/error-handler";

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { pet: true, location: true },
  });

  if (!booking || booking.userId !== userId) {
    throw new NotFoundError("Booking not found");
  }

  return NextResponse.json({ status: 200, success: true, data: booking });
});
