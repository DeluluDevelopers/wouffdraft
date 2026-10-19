import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { verifyOtp } from "../../../../lib/auth";
import z from "zod";

const verifyOTPSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber, otp } = await verifyOTPSchema.parseAsync(
    await req.json(),
  );

  const { user, accessToken, refreshToken } = await verifyOtp(phoneNumber, otp);

  return NextResponse.json({
    status: 200,
    success: true,
    message: "OTP verified successfully",
    data: { accessToken, refreshToken, user },
  });
});
