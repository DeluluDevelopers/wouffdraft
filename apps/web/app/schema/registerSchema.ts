import z from "zod";

export const registerSchema = z.object({
  phoneNumber: z.string(),
});

export const verifyOtp = z.string().length(6);


