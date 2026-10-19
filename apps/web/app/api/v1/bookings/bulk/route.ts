import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../lib/error-handler";
import { SERVICE_VALUES, packDiscountInRupees } from "../../../../lib/catalog";
import { customerBookingInclude as bookingInclude } from "../../../../lib/booking-include";
import z from "zod";

const createBulkBookingSchema = z.object({
  petId: z.uuid(),
  locationId: z.uuid(),
  days: z
    .array(
      z.object({
        scheduledAt: z.coerce.date(),
        service: z.enum(SERVICE_VALUES),
        serviceOptionId: z.uuid(),
      }),
    )
    .min(2, "A multi-day booking needs at least 2 days")
    .max(31, "A multi-day booking can cover at most 31 days"),
  notes: z.string().trim().max(1000).optional(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await createBulkBookingSchema.parseAsync(await req.json());

  const dateKeys = body.days.map((day) => day.scheduledAt.toISOString().slice(0, 10));
  if (new Set(dateKeys).size !== dateKeys.length) {
    throw new BadRequestError("Each day in a multi-day booking must be on a different date");
  }

  if (body.days.some((day) => day.scheduledAt.getTime() <= Date.now())) {
    throw new BadRequestError("Every day in a multi-day booking must be in the future");
  }

  const pet = await prisma.pet.findUnique({ where: { id: body.petId } });
  if (!pet || pet.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }
  if (body.days.some((day) => day.service === "Walk") && pet.species !== "Dog") {
    throw new BadRequestError("Walks are available for dogs only");
  }

  const location = await prisma.location.findUnique({ where: { id: body.locationId } });
  if (!location || location.userId !== userId) {
    throw new NotFoundError("Location not found");
  }

  const serviceOptionIds = [...new Set(body.days.map((day) => day.serviceOptionId))];
  const serviceOptions = await prisma.serviceOption.findMany({
    where: { id: { in: serviceOptionIds } },
  });
  const serviceOptionById = new Map(serviceOptions.map((option) => [option.id, option]));

  for (const day of body.days) {
    const option = serviceOptionById.get(day.serviceOptionId);
    if (!option || !option.isActive) {
      throw new BadRequestError(`Service option ${day.serviceOptionId} is not available`);
    }
    if (option.service !== day.service) {
      throw new BadRequestError(
        `Service option ${day.serviceOptionId} does not match service ${day.service}`,
      );
    }
  }

  const subtotal = body.days.reduce(
    (sum, day) => sum + serviceOptionById.get(day.serviceOptionId)!.priceInRupees,
    0,
  );
  const discountInRupees = packDiscountInRupees(subtotal, body.days.length);
  const totalPriceInRupees = subtotal - discountInRupees;

  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.bookingGroup.create({
      data: {
        userId,
        petId: body.petId,
        locationId: body.locationId,
        totalPriceInRupees,
        discountInRupees,
        dayCount: body.days.length,
      },
    });

    const bookings = [];
    for (const day of body.days) {
      const option = serviceOptionById.get(day.serviceOptionId)!;
      const booking = await tx.booking.create({
        data: {
          userId,
          petId: body.petId,
          locationId: body.locationId,
          type: "Scheduled",
          service: day.service,
          scheduledAt: day.scheduledAt,
          groupId: group.id,
          serviceOptionId: option.id,
          durationMinutes: option.durationMinutes,
          priceInRupees: option.priceInRupees,
          notes: body.notes || null,
        },
        include: bookingInclude,
      });
      bookings.push(booking);
    }

    return { group, bookings };
  });

  return NextResponse.json({ status: 201, success: true, data: result });
});
