import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/jwt";

const publicPrefixes = ["/api/v1/auth/", "/api/v1/address/autocomplete"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function corsResponse(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

export async function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return corsResponse({}, 200);
  }

  if (publicPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return corsResponse(
      { status: 401, success: false, message: "Missing or invalid authorization header" },
      401,
    );
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verifyAccessToken(token);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return corsResponse(
      { status: 401, success: false, message: "Invalid or expired token" },
      401,
    );
  }
}

export const config = {
  matcher: "/api/:path*",
};
