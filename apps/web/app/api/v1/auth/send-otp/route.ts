import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { requestOtp } from "../../../../lib/auth";
import { phoneNumberSchema } from "../../../../schema/registerSchema";
import z from "zod";

const sendOtpSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const POST = apiHandler(async (req: NextRequest) => {
  const { phoneNumber } = await sendOtpSchema.parseAsync(await req.json());

  const { isNewUser } = await requestOtp(phoneNumber);

  return NextResponse.json({
    status: 200,
    success: true,
    message: "OTP sent successfully.",
    data: { isNewUser },
  });
});
