import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../../../lib/error-handler";
import z from "zod";

const createPetSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.enum(["Dog", "Cat"]),
  breed: z.string().optional(),
  ageMonths: z.number().int().positive("Age must be in months"),
  gender: z.enum(["Male", "Female"]),
  vaccinationStatus: z.enum(["UpToDate", "Partial", "None"]),
  medicalConditions: z.boolean(),
  medicalHistory: z.string().optional(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;
  const body = await createPetSchema.parseAsync(await req.json());

  const pet = await prisma.pet.create({
    data: { userId, ...body },
  });

  return NextResponse.json({
    status: 201,
    success: true,
    data: pet,
  });
});

export const GET = apiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id")!;

  const pets = await prisma.pet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    status: 200,
    success: true,
    data: pets,
  });
});
