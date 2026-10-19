import { prisma } from "./prisma";
import { env } from "./env";
import { RateLimitError, UnauthorizedError } from "./error-handler";
import { generateAccessToken, generateRefreshToken } from "./jwt";
import { generateOtp } from "./otp";
import { sendSMS } from "./sms";
import {
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  otpExpiresAt,
} from "../constant/otp";

const DEV_OTP = "123456";

async function deliverOtp(phoneNumber: string) {
  if (env.OTP_DELIVERY === "fixed") return DEV_OTP;

  const code = generateOtp();
  // MessageCentral expects the national number without the country code.
  await sendSMS({ mobileNumber: phoneNumber.replace(/^91/, ""), otp: code });
  return code;
}

/**
 * Issues a fresh OTP for the phone number, creating the user on first contact.
 * A new code can be requested once the resend cooldown has passed.
 */
export async function requestOtp(phoneNumber: string) {
  let user = await prisma.user.findUnique({
    where: { phoneNumber },
    include: { otps: { orderBy: { expiresAt: "desc" }, take: 1 } },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { phoneNumber },
      include: { otps: true },
    });
  }

  const latest = user.otps[0];
  if (latest) {
    const issuedAt = latest.expiresAt.getTime() - OTP_TTL_MS;
    const waitMs = issuedAt + OTP_RESEND_COOLDOWN_MS - Date.now();
    if (waitMs > 0) {
      throw new RateLimitError(
        `Please wait ${Math.ceil(waitMs / 1000)}s before requesting a new code.`,
      );
    }
  }

  const code = await deliverOtp(phoneNumber);

  await prisma.$transaction([
    prisma.otp.deleteMany({ where: { userId: user.id } }),
    prisma.otp.create({
      data: { code, expiresAt: otpExpiresAt(), userId: user.id },
    }),
  ]);

  return { isNewUser: user.profileStatus === "REGISTERED" };
}

/**
 * Validates the OTP, promotes REGISTERED users to VERIFIED and returns tokens.
 */
export async function verifyOtp(phoneNumber: string, otp: string) {
  const validOtp = await prisma.otp.findFirst({
    where: {
      code: otp,
      user: { phoneNumber },
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!validOtp) {
    throw new UnauthorizedError("That code is wrong or has expired.");
  }

  const [, user] = await prisma.$transaction([
    prisma.otp.deleteMany({ where: { user: { phoneNumber } } }),
    prisma.user.update({
      where: { phoneNumber },
      data: {
        profileStatus:
          validOtp.user.profileStatus === "REGISTERED"
            ? "VERIFIED"
            : validOtp.user.profileStatus,
      },
      select: { id: true, name: true, phoneNumber: true, profileStatus: true },
    }),
  ]);

  const payload = { userId: validOtp.userId, phoneNumber };
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);

  return { user, accessToken, refreshToken };
}
