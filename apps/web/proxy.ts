import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/jwt";

const publicPrefixes = ["/api/v1/auth/", "/api/v1/address/autocomplete"];

export async function proxy(request: NextRequest) {
  if (publicPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { status: 401, success: false, message: "Missing or invalid authorization header" },
      { status: 401 },
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
    return NextResponse.json(
      { status: 401, success: false, message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: "/api/:path*",
};
