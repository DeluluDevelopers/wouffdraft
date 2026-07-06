import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { NotFoundError } from "../../../../lib/error-handler";
import { getPlaceDetails } from "../../../../lib/places";
import z from "zod";

const updateLocationSchema = z.object({
  label: z.string().min(1, "Label is required").optional(),
  placeId: z.string().min(1, "Place ID is required").optional(),
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateLocationSchema.parseAsync(await req.json());

  const existing = await prisma.location.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Location not found");
  }

  let address = existing.address;
  let latitude = existing.latitude;
  let longitude = existing.longitude;
  let placeId = existing.placeId;

  if (body.placeId) {
    const details = await getPlaceDetails(body.placeId);
    address = details.address;
    latitude = details.latitude;
    longitude = details.longitude;
    placeId = body.placeId;
  }

  const location = await prisma.location.update({
    where: { id },
    data: {
      label: body.label ?? existing.label,
      placeId,
      address,
      latitude,
      longitude,
    },
  });

  return NextResponse.json({ status: 200, success: true, data: location });
});
