import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { prisma } from "../../../../lib/prisma";
import { NotFoundError, BadRequestError } from "../../../../lib/error-handler";
import { OTP_EXPIRATION_TIME } from "../../../../constant/otp";
import { generateOtp } from "../../../../lib/otp";
import { sendSMS } from "../../../../lib/sms";
import z from "zod";

const sendOtpSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber } = await sendOtpSchema.parseAsync(await req.json());

  console.log("Received send OTP request for phone number:", phoneNumber);

  let user = await prisma.user.findUnique({
    where: { phoneNumber },
    include: { otps: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { phoneNumber },
      include: { otps: true },
    });
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
