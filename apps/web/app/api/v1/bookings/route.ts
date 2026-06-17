import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../../../lib/error-handler";
import z from "zod";

const createBookingSchema = z
  .object({
    petId: z.string().uuid(),
    type: z.enum(["Instant", "Scheduled"]),
    scheduledAt: z.date().optional(),
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

  const pet = await prisma.pet.findUnique({
    where: { id: body.petId },
  });

  if (!pet || pet.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      petId: body.petId,
      type: body.type,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json({ status: 201, success: true, data: booking });
});

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const { searchParams } = new URL(req.url);
  const petId = searchParams.get("petId");

  const where: Record<string, unknown> = { userId };
  if (petId) where.petId = petId;

  const bookings = await prisma.booking.findMany({
    where,
    include: { pet: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: bookings });
});
