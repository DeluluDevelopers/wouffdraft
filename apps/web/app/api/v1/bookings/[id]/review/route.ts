import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../../../lib/error-handler";
import z from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

// Rate a completed booking. Posting again updates the existing review.
export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").at(-2);
  const body = await reviewSchema.parseAsync(await req.json());

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.userId !== userId) {
    throw new NotFoundError("Booking not found");
  }
  if (booking.status !== "COMPLETED") {
    throw new BadRequestError("Only completed bookings can be reviewed");
  }

  const review = await prisma.review.upsert({
    where: { bookingId: booking.id },
    update: { rating: body.rating, comment: body.comment || null },
    create: {
      bookingId: booking.id,
      userId,
      walkerId: booking.walkerId,
      rating: body.rating,
      comment: body.comment || null,
    },
  });

  return NextResponse.json({ status: 200, success: true, data: review });
});
