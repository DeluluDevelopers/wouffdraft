import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../../lib/api-handler";
import { prisma } from "../../../../../lib/prisma";
import { NotFoundError } from "../../../../../lib/error-handler";
import { walkerSchema } from "../../../../../schema/walkerSchema";

const updateWalkerSchema = walkerSchema.partial();

export const PATCH = apiHandler(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await updateWalkerSchema.parseAsync(await req.json());

  const existing = await prisma.walker.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Walker not found");
  }

  const walker = await prisma.walker.update({
    where: { id },
    data: {
      ...body,
      ...(body.photoUrl !== undefined ? { photoUrl: body.photoUrl || null } : {}),
    },
  });

  return NextResponse.json({ status: 200, success: true, data: walker });
});
