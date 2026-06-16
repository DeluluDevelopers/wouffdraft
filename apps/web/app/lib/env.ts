import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET should be at least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET should be at least 32 characters"),

  PORT: z.coerce.number().default(3000),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "GOOGLE_MAPS_API_KEY is required"),
  MESSAGECENTRAL_CUSTOMER_ID: z
    .string()
    .min(1, "MESSAGECENTRAL_CUSTOMER_ID is required"),
  MESSAGECENTRAL_BASE64_KEY: z
    .string()
    .min(1, "MESSAGECENTRAL_BASE64_KEY is required (base64-encoded password from MessageCentral)"),
});

export const env = envSchema.parse(process.env);
