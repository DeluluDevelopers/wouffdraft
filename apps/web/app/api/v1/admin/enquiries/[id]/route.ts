import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";
import z from "zod";

const updateSchema = z.object({
  status: z.enum(["NEW", "RESOLVED"]),
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateSchema.parseAsync(await req.json());

  const existing = await prisma.enquiry.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Enquiry not found");
  }

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ status: 200, success: true, data: enquiry });
});
