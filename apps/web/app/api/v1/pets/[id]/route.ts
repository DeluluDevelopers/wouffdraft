import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../lib/error-handler";
import z from "zod";

const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.enum(["Dog", "Cat"]).optional(),
  breed: z.string().nullable().optional(),
  ageMonths: z.number().int().positive().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  vaccinationStatus: z.enum(["UpToDate", "Partial", "None"]).optional(),
  medicalConditions: z.boolean().optional(),
  medicalHistory: z.string().nullable().optional(),
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop()!;

  const existing = await prisma.pet.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }

  const body = await updatePetSchema.parseAsync(await req.json());
  const pet = await prisma.pet.update({ where: { id }, data: body });

  return NextResponse.json({
    status: 200,
    success: true,
    data: pet,
  });
});

export const DELETE = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop()!;

  const existing = await prisma.pet.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true, bookingGroups: true } } },
  });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }

  // Booking history references the pet, so pets with bookings stay on file.
  if (existing._count.bookings > 0 || existing._count.bookingGroups > 0) {
    throw new BadRequestError("Pets with bookings can't be removed");
  }

  await prisma.pet.delete({ where: { id } });

  return NextResponse.json({
    status: 200,
    success: true,
    data: null,
  });
});
