import z from "zod";

// Phone numbers are stored with the country code and no "+", e.g. 919876543210.
export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{11,15}$/, "Enter a valid phone number including the country code");

export const registerSchema = z.object({
  phoneNumber: z.string(),
});

export const verifyOtp = z.string().length(6);
