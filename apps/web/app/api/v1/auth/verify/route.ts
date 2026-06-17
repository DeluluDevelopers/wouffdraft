import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { UnauthorizedError } from "../../../../lib/error-handler";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";

const verifyOTPSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber, otp } = await verifyOTPSchema.parseAsync(
    await req.json(),
  );

  const validOtp = await prisma.otp.findFirst({
    where: {
      code: otp,
      user: {
        phoneNumber,
      },
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
  if (!validOtp) {
    throw new UnauthorizedError("Invalid OTP");
  }
  await prisma.$transaction([
    prisma.otp.deleteMany({
      where: {
        user: {
          phoneNumber,
        },
      },
    }),
    prisma.user.update({
      where: { phoneNumber },
      data: {
        profileStatus:
          validOtp.user.profileStatus === "REGISTERED"
            ? "VERIFIED"
            : validOtp.user.profileStatus,
      },
    }),
  ]);
  const accessToken = await generateAccessToken({
    userId: validOtp.userId,
    phoneNumber,
  });
  const refreshToken = await generateRefreshToken({
    userId: validOtp.userId,
    phoneNumber,
  });
  return NextResponse.json({
    status: 200,
    success: true,
    message: "OTP verified successfully",
    data: { accessToken, refreshToken },
  });
});
