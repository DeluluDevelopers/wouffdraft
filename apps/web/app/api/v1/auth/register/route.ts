import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "../../../../schema/registerSchema";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError } from "../../../../lib/error-handler";
import { OTP_EXPIRATION_TIME } from "../../../../constant/otp";

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber } = await registerSchema.parseAsync(
    await req.json(),
  );

  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (existingUser) {
    throw new BadRequestError("User with this phone number already exists");
  }

  await prisma.user.create({
    data: {
      phoneNumber,
      otps: {
        create: {
          code: "123456",
          expiresAt: OTP_EXPIRATION_TIME,
        },
      },
    },
  });

  // Fix this later to send actual OTP instead of hardcoded value
  // await sendSMS({ mobileNumber: phoneNumber });
  return NextResponse.json({
    status: 201,
    success: true,
    message: "User registered successfully. OTP sent to phone number.",
  });
});
