import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "../../../../schema/registerSchema";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { BadRequestError } from "../../../../lib/error-handler";
import { OTP_EXPIRATION_TIME } from "../../../../constant/otp";
import { generateOtp } from "../../../../lib/otp";
import { sendSMS } from "../../../../lib/sms";

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber } = await registerSchema.parseAsync(await req.json());

  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (existingUser) {
    throw new BadRequestError("User with this phone number already exists");
  }

  // const otpCode = generateOtp();
  const otpCode = "123456";

  // await sendSMS({ mobileNumber: phoneNumber, otp: otpCode });
  await prisma.user.create({
    data: {
      phoneNumber,
      otps: {
        create: {
          code: otpCode,
          expiresAt: OTP_EXPIRATION_TIME,
        },
      },
    },
  });

  return NextResponse.json({
    status: 201,
    success: true,
    message: "User registered successfully. OTP sent to phone number.",
  });
});
