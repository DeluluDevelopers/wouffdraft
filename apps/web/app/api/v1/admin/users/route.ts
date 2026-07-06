import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/client";

const PROFILE_STATUS_VALUES = [
  "REGISTERED",
  "VERIFIED",
  "PROFILE_COMPLETED",
  "SUSPENDED",
] as const;

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const profileStatus = searchParams.get("profileStatus");

  const where: Prisma.UserWhereInput = {};

  if (
    profileStatus &&
    PROFILE_STATUS_VALUES.includes(profileStatus as (typeof PROFILE_STATUS_VALUES)[number])
  ) {
    where.profileStatus = profileStatus as (typeof PROFILE_STATUS_VALUES)[number];
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phoneNumber: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      profileStatus: true,
      _count: {
        select: { pets: true, bookings: true, location: true },
      },
    },
    orderBy: { phoneNumber: "asc" },
  });

  return NextResponse.json({ status: 200, success: true, data: users });
});
