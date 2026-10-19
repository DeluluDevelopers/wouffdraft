import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../lib/error-handler";
import { ALLOWED_TRANSITIONS, isValidTransition } from "../../../../lib/booking-status";
import { customerBookingInclude as bookingInclude } from "../../../../lib/booking-include";
import z from "zod";

const updateBookingSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("cancel"),
    cancellationReason: z.string().trim().min(1),
  }),
  z.object({
    action: z.literal("reschedule"),
    scheduledAt: z.coerce.date(),
  }),
]);

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });

  if (!booking || booking.userId !== userId) {
    throw new NotFoundError("Booking not found");
  }

  return NextResponse.json({ status: 200, success: true, data: booking });
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateBookingSchema.parseAsync(await req.json());

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Booking not found");
  }

  if (body.action === "cancel") {
    if (!isValidTransition(existing.status, "CANCELLED")) {
      throw new BadRequestError(`Cannot cancel a booking that is ${existing.status}`);
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancellationReason: body.cancellationReason },
      include: bookingInclude,
    });

    return NextResponse.json({ status: 200, success: true, data: booking });
  }

  if (ALLOWED_TRANSITIONS[existing.status].length === 0) {
    throw new BadRequestError(`Cannot reschedule a booking that is ${existing.status}`);
  }
  if (existing.type !== "Scheduled") {
    throw new BadRequestError("Only Scheduled bookings can be rescheduled");
  }
  if (body.scheduledAt.getTime() <= Date.now()) {
    throw new BadRequestError("The new scheduled time must be in the future");
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { scheduledAt: body.scheduledAt },
    include: bookingInclude,
  });

  return NextResponse.json({ status: 200, success: true, data: booking });
});
