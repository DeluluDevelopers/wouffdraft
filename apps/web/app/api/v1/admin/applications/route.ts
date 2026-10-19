import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/client";

const STATUS_VALUES = ["NEW", "SHORTLISTED", "ONBOARDED", "REJECTED"] as const;

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const where: Prisma.WalkerApplicationWhereInput = {};
  if (status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    where.status = status as (typeof STATUS_VALUES)[number];
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phoneNumber: { contains: search } },
      { city: { contains: search, mode: "insensitive" } },
      { area: { contains: search, mode: "insensitive" } },
    ];
  }

  const applications = await prisma.walkerApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: applications });
});
