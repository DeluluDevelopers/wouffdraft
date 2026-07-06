import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";
import z from "zod";

const updateServiceOptionSchema = z.object({
  label: z.string().trim().min(1).optional(),
  priceInRupees: z.coerce.number().int().positive().optional(),
  durationMinutes: z.coerce.number().int().positive().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateServiceOptionSchema.parseAsync(await req.json());

  const existing = await prisma.serviceOption.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Service option not found");
  }

  const serviceOption = await prisma.serviceOption.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ status: 200, success: true, data: serviceOption });
});
