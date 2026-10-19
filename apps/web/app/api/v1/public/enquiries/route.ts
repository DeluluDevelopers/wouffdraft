import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { assertRateLimit, clientIp } from "../../../../lib/rate-limit";
import z from "zod";

const enquirySchema = z
  .object({
    topic: z.enum(["General", "Booking", "Partnership", "Press", "CityWaitlist"]).default("General"),
    name: z.string().trim().min(1, "Please tell us your name").max(120),
    email: z.email("Enter a valid email").optional().or(z.literal("")),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .optional()
      .or(z.literal("")),
    city: z.string().trim().max(80).optional(),
    message: z.string().trim().max(2000).optional(),
    // Honeypot: real visitors never see or fill this field.
    website: z.string().max(0).optional(),
  })
  .refine((data) => !!data.email || !!data.phoneNumber, {
    message: "Share an email or a phone number so we can reply",
    path: ["email"],
  });

export const POST = apiHandler(async (req: NextRequest) => {
  assertRateLimit(`enquiry:${clientIp(req)}`, 5, 10 * 60 * 1000);
  const body = await enquirySchema.parseAsync(await req.json());

  await prisma.enquiry.create({
    data: {
      topic: body.topic,
      name: body.name,
      email: body.email || null,
      phoneNumber: body.phoneNumber ? `91${body.phoneNumber}` : null,
      city: body.city || null,
      message: body.message || null,
    },
  });

  return NextResponse.json({
    status: 201,
    success: true,
    message: "Thanks! We'll be in touch soon.",
  });
});
