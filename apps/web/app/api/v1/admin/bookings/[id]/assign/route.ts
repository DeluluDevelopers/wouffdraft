import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../../lib/api-handler";
import { prisma } from "../../../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../../../lib/error-handler";
import z from "zod";

const assignSchema = z.object({
  walkerId: z.uuid().nullable(),
});

// Assigning a walker to a pending booking also confirms it.
export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").at(-2);
  const { walkerId } = await assignSchema.parseAsync(await req.json());

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
    throw new BadRequestError(`Cannot change the walker on a ${booking.status} booking`);
  }

  if (walkerId) {
    const walker = await prisma.walker.findUnique({ where: { id: walkerId } });
    if (!walker || !walker.isActive) {
      throw new BadRequestError("This walker is not active");
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      walkerId,
      status: walkerId && booking.status === "PENDING" ? "CONFIRMED" : booking.status,
    },
    include: { walker: true },
  });

  return NextResponse.json({ status: 200, success: true, data: updated });
});
