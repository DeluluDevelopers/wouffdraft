import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { UnauthorizedError } from "../../../../lib/error-handler";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../../../../lib/jwt";
import z from "zod";

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const { refreshToken } = await refreshSchema.parseAsync(await req.json());

  let payload: { userId: string; phoneNumber: string };
  console.log("Received refresh token:", refreshToken);
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const accessToken = await generateAccessToken({
    userId: payload.userId,
    phoneNumber: payload.phoneNumber,
  });

  const newRefreshToken = await generateRefreshToken({
    userId: payload.userId,
    phoneNumber: payload.phoneNumber,
  });

  return NextResponse.json({
    status: 200,
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken, refreshToken: newRefreshToken },
  });
});
