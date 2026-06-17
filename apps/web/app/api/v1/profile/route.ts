import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { ForbiddenError } from "../../../lib/error-handler";
import { BadRequestError } from "../../../lib/error-handler";
import { NotFoundError } from "../../../lib/error-handler";
import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "../../../lib/env";
import z from "zod";
const client = new Client({});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  placeId: z.string().min(1, "Place ID is required"),
  pets: z
    .array(
      z.object({
        name: z.string().min(1, "Pet name is required"),
        species: z.enum(["Dog", "Cat"]),
        breed: z.string().optional(),
        ageMonths: z.number().int().positive("Age must be in months"),
        gender: z.enum(["Male", "Female"]),
        vaccinationStatus: z.enum(["UpToDate", "Partial", "None"]),
        medicalConditions: z.boolean(),
        medicalHistory: z.string().optional(),
      }),
    )
    .min(1, "At least one pet is required"),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await updateProfileSchema.parseAsync(await req.json());

  const user = await prisma.user.update({
    where: { id: userId },
    data: body,
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({
    status: 200,
    success: true,
    data: user,
  });
});

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      profileStatus: true,
      location: {
        select: {
          id: true,
          label: true,
          placeId: true,
          address: true,
          latitude: true,
          longitude: true,
        },
      },
      pets: {
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          ageMonths: true,
          gender: true,
          vaccinationStatus: true,
          medicalConditions: true,
          medicalHistory: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return NextResponse.json({
    status: 200,
    success: true,
    data: user,
  });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await profileSchema.parseAsync(await req.json());

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ForbiddenError("User not found");
  }

  if (
    user.profileStatus !== "VERIFIED" &&
    user.profileStatus !== "PROFILE_COMPLETED"
  ) {
    throw new ForbiddenError(
      "Profile can only be completed after phone verification",
    );
  }

  // Already completed — idempotent success
  if (user.profileStatus === "PROFILE_COMPLETED") {
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Profile already completed.",
    });
  }

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

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        profileStatus: "PROFILE_COMPLETED",
      },
    }),
    prisma.location.create({
      data: {
        userId,
        label: body.label,
        placeId: body.placeId,
        address,
        latitude,
        longitude,
      },
    }),
    ...body.pets.map((pet) =>
      prisma.pet.create({
        data: {
          userId,
          ...pet,
        },
      }),
    ),
  ]);

  return NextResponse.json({
    status: 200,
    success: true,
    message: "Profile completed successfully.",
  });
});
