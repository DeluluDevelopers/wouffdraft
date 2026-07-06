import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { getPlaceDetails } from "../../../lib/places";
import z from "zod";

const createLocationSchema = z.object({
  label: z.string().min(1, "Label is required"),
  placeId: z.string().min(1, "Place ID is required"),
});

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;

  const locations = await prisma.location.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: locations });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await createLocationSchema.parseAsync(await req.json());

  const { address, latitude, longitude } = await getPlaceDetails(body.placeId);

  const location = await prisma.location.create({
    data: {
      userId,
      label: body.label,
      placeId: body.placeId,
      address,
      latitude,
      longitude,
    },
  });

  return NextResponse.json({ status: 201, success: true, data: location });
});
