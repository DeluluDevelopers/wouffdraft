import { NextResponse } from "next/server";
import { apiHandler } from "../../../../lib/api-handler";

export const POST = apiHandler(async () => {
  const response = NextResponse.json({
    status: 200,
    success: true,
    message: "Logged out",
  });

  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
});
