import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";
import { UnauthorizedError } from "../../../../lib/error-handler";
import { generateAdminToken } from "../../../../lib/jwt";
import { env } from "../../../../lib/env";
import z from "zod";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await loginSchema.parseAsync(await req.json());

  if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
    throw new UnauthorizedError("Invalid username or password");
  }

  const token = await generateAdminToken();

  const response = NextResponse.json({
    status: 200,
    success: true,
    message: "Logged in",
  });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
});
