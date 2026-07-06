import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../lib/api-handler";
import { prisma } from "../../../lib/prisma";

export const GET = apiHandler(async (_req: NextRequest) => {
  const serviceOptions = await prisma.serviceOption.findMany({
    where: { isActive: true },
    orderBy: [{ service: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json({ status: 200, success: true, data: serviceOptions });
});
