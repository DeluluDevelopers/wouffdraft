import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { SERVICE_VALUES } from "../../../../lib/catalog";
import z from "zod";


const createServiceOptionSchema = z.object({
  service: z.enum(SERVICE_VALUES),
  durationMinutes: z.coerce.number().int().positive(),
  label: z.string().trim().min(1),
  priceInRupees: z.coerce.number().int().positive(),
  sortOrder: z.coerce.number().int().optional(),
});

export const GET = apiHandler(async (_req: NextRequest) => {
  const serviceOptions = await prisma.serviceOption.findMany({
    orderBy: [{ service: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json({ status: 200, success: true, data: serviceOptions });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await createServiceOptionSchema.parseAsync(await req.json());

  const serviceOption = await prisma.serviceOption.create({
    data: {
      service: body.service,
      durationMinutes: body.durationMinutes,
      label: body.label,
      priceInRupees: body.priceInRupees,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ status: 201, success: true, data: serviceOption });
});
