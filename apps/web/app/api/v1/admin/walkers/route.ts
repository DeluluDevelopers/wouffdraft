import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError } from "../../../../lib/error-handler";
import { walkerSchema } from "../../../../schema/walkerSchema";

export const GET = apiHandler(async () => {
  const [walkers, ratings] = await Promise.all([
    prisma.walker.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      include: { _count: { select: { bookings: true, reviews: true } } },
    }),
    prisma.review.groupBy({
      by: ["walkerId"],
      _avg: { rating: true },
    }),
  ]);

  const ratingByWalker = new Map(ratings.map((row) => [row.walkerId, row._avg.rating]));

  return NextResponse.json({
    status: 200,
    success: true,
    data: walkers.map((walker) => ({
      ...walker,
      averageRating: ratingByWalker.get(walker.id) ?? null,
    })),
  });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await walkerSchema.parseAsync(await req.json());

  const existing = await prisma.walker.findUnique({ where: { phoneNumber: body.phoneNumber } });
  if (existing) {
    throw new BadRequestError("A walker with this phone number already exists");
  }

  const walker = await prisma.walker.create({
    data: { ...body, photoUrl: body.photoUrl || null },
  });

  return NextResponse.json({ status: 201, success: true, data: walker });
});
