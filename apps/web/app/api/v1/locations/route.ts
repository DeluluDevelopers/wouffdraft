import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../../lib/error-handler";
import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "../../../lib/env";
import z from "zod";

const client = new Client({});

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

  const placeResponse = await client.placeDetails({
    params: {
      place_id: body.placeId,
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (placeResponse.data.status !== "OK") {
    throw new BadRequestError("Invalid place ID");
  }

  const result = placeResponse.data.result;
  const address = result.formatted_address;
  const latitude = result.geometry?.location.lat;
  const longitude = result.geometry?.location.lng;

  if (!address || latitude === undefined || longitude === undefined) {
    throw new BadRequestError("Could not resolve address from place ID");
  }

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
