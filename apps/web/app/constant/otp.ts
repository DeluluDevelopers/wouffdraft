export const OTP_LENGTH = 6;
export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds

// Computed per call. A module-level `new Date(...)` would freeze the expiry at
// server boot, so every OTP issued more than five minutes after startup would
// already be expired.
export function otpExpiresAt() {
  return new Date(Date.now() + OTP_TTL_MS);
}
