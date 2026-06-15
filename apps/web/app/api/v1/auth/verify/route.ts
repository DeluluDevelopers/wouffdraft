import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { UnauthorizedError } from "../../../../lib/error-handler";
import { generateAccessToken } from "../../../../lib/jwt";

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
        profileStatus: "VERIFIED",
      },
    }),
  ]);
  const accessToken = generateAccessToken({
    userId: validOtp.userId,
    phoneNumber,
  });
  return NextResponse.json({ message: "OTP verified successfully" });
});
