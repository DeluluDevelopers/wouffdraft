import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/client";

const STATUS_VALUES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
const SERVICE_VALUES = [
  "Bathing",
  "Cutting",
  "Hygiene",
  "BlowDry",
  "NailTrim",
  "Spa",
  "Cleaning",
] as const;
const TYPE_VALUES = ["Instant", "Scheduled"] as const;

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const service = searchParams.get("service");
  const type = searchParams.get("type");
  const search = searchParams.get("search")?.trim();

  const where: Prisma.BookingWhereInput = {};

  if (status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    where.status = status as (typeof STATUS_VALUES)[number];
  }
  if (service && SERVICE_VALUES.includes(service as (typeof SERVICE_VALUES)[number])) {
    where.service = service as (typeof SERVICE_VALUES)[number];
  }
  if (type && TYPE_VALUES.includes(type as (typeof TYPE_VALUES)[number])) {
    where.type = type as (typeof TYPE_VALUES)[number];
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { phoneNumber: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { pet: { name: { contains: search, mode: "insensitive" } } },
      { location: { label: { contains: search, mode: "insensitive" } } },
      { location: { address: { contains: search, mode: "insensitive" } } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      pet: true,
      location: true,
      user: {
        select: { id: true, name: true, phoneNumber: true, email: true },
      },
      group: { select: { id: true, dayCount: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: bookings });
});
