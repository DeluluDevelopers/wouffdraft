import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyAdminToken } from "./app/lib/jwt";

const publicPrefixes = ["/api/v1/auth/", "/api/v1/address/autocomplete", "/api/v1/public/"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function corsResponse(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

async function hasValidAdminSession(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return false;
  try {
    await verifyAdminToken(session);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS") {
    return corsResponse({}, 200);
  }

  // Admin dashboard pages
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    if (!(await hasValidAdminSession(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Admin API routes
  if (pathname.startsWith("/api/v1/admin/")) {
    if (pathname === "/api/v1/admin/login") {
      return NextResponse.next();
    }
    if (!(await hasValidAdminSession(request))) {
      return corsResponse(
        { status: 401, success: false, message: "Admin authentication required" },
        401,
      );
    }
    return NextResponse.next();
  }

  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
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
  matcher: ["/api/:path*", "/admin/:path*"],
};
