import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { NotFoundError } from "../../../../lib/error-handler";
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

  const existing = await prisma.pet.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new NotFoundError("Pet not found");
  }

  await prisma.pet.delete({ where: { id } });

  return NextResponse.json({
    status: 200,
    success: true,
    data: null,
  });
});
