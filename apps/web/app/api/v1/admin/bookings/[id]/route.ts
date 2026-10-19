import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../../lib/error-handler";
import { BOOKING_STATUS_VALUES, isValidTransition } from "../../../../../lib/booking-status";
import z from "zod";

const updateStatusSchema = z
  .object({
    status: z.enum(BOOKING_STATUS_VALUES),
    cancellationReason: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) => data.status !== "CANCELLED" || !!data.cancellationReason,
    {
      message: "A cancellation reason is required when cancelling a booking",
      path: ["cancellationReason"],
    },
  );

const bookingInclude = {
  pet: true,
  location: true,
  user: { select: { id: true, name: true, phoneNumber: true, email: true } },
  walker: true,
  report: true,
  review: true,
  group: {
    include: {
      bookings: {
        select: { id: true, scheduledAt: true, status: true, service: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  },
} as const;

export const GET = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
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

  if (!isValidTransition(existing.status, body.status)) {
    throw new BadRequestError(
      `Cannot move a booking from ${existing.status} to ${body.status}`,
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status,
      cancellationReason:
        body.status === "CANCELLED"
          ? body.cancellationReason
          : existing.cancellationReason,
    },
    include: bookingInclude,
  });

  return NextResponse.json({ status: 200, success: true, data: booking });
});
