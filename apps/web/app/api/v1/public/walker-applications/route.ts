import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { assertRateLimit, clientIp } from "../../../../lib/rate-limit";
import z from "zod";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  phoneNumber: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().trim().min(1, "Choose your city").max(80),
  area: z.string().trim().min(1, "Tell us your neighbourhood").max(120),
  experience: z.enum(["None", "Own pets", "Pet care work", "Professional"]),
  availability: z
    .array(z.enum(["Early mornings", "Mornings", "Afternoons", "Evenings", "Weekends"]))
    .min(1, "Pick at least one time you're free"),
  hasOwnPet: z.boolean().default(false),
  about: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  assertRateLimit(`application:${clientIp(req)}`, 3, 10 * 60 * 1000);
  const body = await applicationSchema.parseAsync(await req.json());

  await prisma.walkerApplication.create({
    data: {
      name: body.name,
      phoneNumber: `91${body.phoneNumber}`,
      email: body.email || null,
      city: body.city,
      area: body.area,
      experience: body.experience,
      availability: body.availability,
      hasOwnPet: body.hasOwnPet,
      about: body.about || null,
    },
  });

  return NextResponse.json({
    status: 201,
    success: true,
    message: "Application received. We'll call you within 3 working days.",
  });
});
