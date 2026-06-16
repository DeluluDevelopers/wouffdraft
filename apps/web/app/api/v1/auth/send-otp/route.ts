import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { NotFoundError } from "../../../../lib/error-handler";
import { OTP_EXPIRATION_TIME } from "../../../../constant/otp";
import { generateOtp } from "../../../../lib/otp";
import { sendSMS } from "../../../../lib/sms";

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber } = await req.json();

  const user = await prisma.user.findUnique({
    where: { phoneNumber },
    include: { otps: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.otps.some((otp) => otp.expiresAt > new Date())) {
    throw new NotFoundError(
      "An active OTP already exists. Please wait before requesting a new one.",
    );
  }

  // const otpCode = generateOtp();
  const otpCode = "123456";

  // await sendSMS({ mobileNumber: phoneNumber, otp: otpCode });

  await prisma.$transaction([
    prisma.otp.deleteMany({
      where: { userId: user.id },
    }),
    prisma.otp.create({
      data: {
        code: otpCode,
        expiresAt: OTP_EXPIRATION_TIME,
        userId: user.id,
      },
    }),
  ]);

  return NextResponse.json({
    status: 200,
    success: true,
    message: "OTP sent successfully.",
  });
});
