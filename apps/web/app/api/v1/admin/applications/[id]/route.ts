import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";
import z from "zod";

const updateSchema = z.object({
  status: z.enum(["NEW", "SHORTLISTED", "ONBOARDED", "REJECTED"]),
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateSchema.parseAsync(await req.json());

  const existing = await prisma.walkerApplication.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Application not found");
  }

  const application = await prisma.walkerApplication.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ status: 200, success: true, data: application });
});
