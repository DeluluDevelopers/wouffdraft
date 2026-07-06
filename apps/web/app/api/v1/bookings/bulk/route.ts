import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../lib/error-handler";
import z from "zod";

const SERVICE_VALUES = [
  "Bathing",
  "Cutting",
  "Hygiene",
  "BlowDry",
  "NailTrim",
  "Spa",
  "Cleaning",
] as const;

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
    .min(2, "A multi-day booking needs at least 2 days"),
});

const bookingInclude = { pet: true, location: true } as const;

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await createBulkBookingSchema.parseAsync(await req.json());

  const dateKeys = body.days.map((day) => day.scheduledAt.toISOString().slice(0, 10));
  if (new Set(dateKeys).size !== dateKeys.length) {
    throw new BadRequestError("Each day in a multi-day booking must be on a different date");
  }

  const pet = await prisma.pet.findUnique({ where: { id: body.petId } });
  if (!pet || pet.userId !== userId) {
    throw new NotFoundError("Pet not found");
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

  const totalPriceInRupees = body.days.reduce(
    (sum, day) => sum + serviceOptionById.get(day.serviceOptionId)!.priceInRupees,
    0,
  );

  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.bookingGroup.create({
      data: {
        userId,
        petId: body.petId,
        locationId: body.locationId,
        totalPriceInRupees,
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
        },
        include: bookingInclude,
      });
      bookings.push(booking);
    }

    return { group, bookings };
  });

  return NextResponse.json({ status: 201, success: true, data: result });
});
