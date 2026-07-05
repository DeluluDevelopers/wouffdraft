import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";
import z from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export const GET = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      pet: true,
      location: true,
      user: { select: { id: true, name: true, phoneNumber: true, email: true } },
    },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  return NextResponse.json({ status: 200, success: true, data: booking });
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateStatusSchema.parseAsync(await req.json());

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Booking not found");
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: body.status },
    include: {
      pet: true,
      location: true,
      user: { select: { id: true, name: true, phoneNumber: true, email: true } },
    },
  });

  return NextResponse.json({ status: 200, success: true, data: booking });
});
