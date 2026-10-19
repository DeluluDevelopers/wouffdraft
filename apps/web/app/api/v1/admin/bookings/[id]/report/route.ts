import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../../lib/api-handler";
import { prisma } from "../../../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../../../lib/error-handler";
import z from "zod";

const reportSchema = z.object({
  startedAt: z.coerce.date().optional().nullable(),
  endedAt: z.coerce.date().optional().nullable(),
  distanceMeters: z.coerce.number().int().min(0).max(50_000).optional().nullable(),
  pee: z.boolean().default(false),
  poo: z.boolean().default(false),
  water: z.boolean().default(false),
  fed: z.boolean().default(false),
  mood: z.enum(["Happy", "Calm", "Energetic", "Anxious"]).default("Happy"),
  note: z.string().trim().min(1, "Add a short note for the pet parent").max(2000),
  photoUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  route: z
    .array(z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]))
    .max(2000)
    .optional()
    .nullable(),
});

// Saves the visit report. A confirmed booking is marked completed with it.
export const PUT = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").at(-2)!;
  const body = await reportSchema.parseAsync(await req.json());

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  if (booking.status === "CANCELLED" || booking.status === "PENDING") {
    throw new BadRequestError("Reports can only be added to confirmed or completed bookings");
  }

  const data = {
    startedAt: body.startedAt ?? null,
    endedAt: body.endedAt ?? null,
    distanceMeters: body.distanceMeters ?? null,
    pee: body.pee,
    poo: body.poo,
    water: body.water,
    fed: body.fed,
    mood: body.mood,
    note: body.note,
    photoUrl: body.photoUrl || null,
    route: body.route ?? undefined,
  };

  const [report] = await prisma.$transaction([
    prisma.visitReport.upsert({
      where: { bookingId: id },
      update: data,
      create: { bookingId: id, ...data },
    }),
    prisma.booking.update({
      where: { id },
      data: { status: "COMPLETED" },
    }),
  ]);

  return NextResponse.json({ status: 200, success: true, data: report });
});
