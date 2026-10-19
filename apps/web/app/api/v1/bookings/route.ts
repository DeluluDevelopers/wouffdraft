import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../lib/error-handler";
import { SERVICE_VALUES } from "../../../lib/catalog";
import { customerBookingInclude } from "../../../lib/booking-include";
import { BOOKING_STATUS_VALUES } from "../../../lib/booking-status";
import z from "zod";

const createBookingSchema = z
  .object({
    petId: z.uuid(),
    locationId: z.uuid(),
    service: z.enum(SERVICE_VALUES),
    type: z.enum(["Instant", "Scheduled"]),
    scheduledAt: z.coerce.date().optional(),
    serviceOptionId: z.uuid().optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "Scheduled" && !data.scheduledAt) {
        return false;
      }
      return true;
    },
    {
      message: "scheduledAt is required for Scheduled bookings",
      path: ["scheduledAt"],
    },
  );

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await createBookingSchema.parseAsync(await req.json());

  if (body.type === "Scheduled" && body.scheduledAt!.getTime() <= Date.now()) {
    throw new BadRequestError("The scheduled time must be in the future");
  }

  const pet = await prisma.pet.findUnique({
    where: { id: body.petId },
  });

  if (!pet || pet.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }

  if (body.service === "Walk" && pet.species !== "Dog") {
    throw new BadRequestError("Walks are available for dogs only");
  }

  const location = await prisma.location.findUnique({
    where: { id: body.locationId },
  });

  if (!location || location.userId !== userId) {
    throw new NotFoundError("Location not found");
  }

  let pricing: { serviceOptionId: string; durationMinutes: number; priceInRupees: number } | null =
    null;
  if (body.serviceOptionId) {
    const option = await prisma.serviceOption.findUnique({
      where: { id: body.serviceOptionId },
    });
    if (!option || !option.isActive) {
      throw new BadRequestError("This service option is not available");
    }
    if (option.service !== body.service) {
      throw new BadRequestError(`Service option does not match service ${body.service}`);
    }
    pricing = {
      serviceOptionId: option.id,
      durationMinutes: option.durationMinutes,
      priceInRupees: option.priceInRupees,
    };
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      petId: body.petId,
      locationId: body.locationId,
      service: body.service,
      type: body.type,
      scheduledAt: body.scheduledAt ?? null,
      notes: body.notes || null,
      ...pricing,
    },
    include: customerBookingInclude,
  });

  return NextResponse.json({ status: 201, success: true, data: booking });
});

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const { searchParams } = new URL(req.url);
  const petId = searchParams.get("petId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { userId };
  if (petId) where.petId = petId;
  if (status && BOOKING_STATUS_VALUES.includes(status as (typeof BOOKING_STATUS_VALUES)[number])) {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: customerBookingInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: bookings });
});
