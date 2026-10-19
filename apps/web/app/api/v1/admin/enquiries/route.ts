import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/client";

const STATUS_VALUES = ["NEW", "RESOLVED"] as const;
const TOPIC_VALUES = ["General", "Booking", "Partnership", "Press", "CityWaitlist"] as const;

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const topic = searchParams.get("topic");

  const where: Prisma.EnquiryWhereInput = {};
  if (status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    where.status = status as (typeof STATUS_VALUES)[number];
  }
  if (topic && TOPIC_VALUES.includes(topic as (typeof TOPIC_VALUES)[number])) {
    where.topic = topic as (typeof TOPIC_VALUES)[number];
  }

  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: 200, success: true, data: enquiries });
});
