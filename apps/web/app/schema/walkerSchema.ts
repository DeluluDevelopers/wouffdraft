import z from "zod";

export const walkerSchema = z.object({
  name: z.string().trim().min(1),
  phoneNumber: z.string().trim().regex(/^91[6-9]\d{9}$/, "Use the 91XXXXXXXXXX format"),
  city: z.string().trim().min(1),
  area: z.string().trim().optional().nullable(),
  bio: z.string().trim().max(600).optional().nullable(),
  photoUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  yearsExperience: z.coerce.number().int().min(0).max(60).default(0),
  languages: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});
