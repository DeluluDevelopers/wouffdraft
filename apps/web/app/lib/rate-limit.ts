import type { NextRequest } from "next/server";
import { RateLimitError } from "./error-handler";

// Best-effort, per-instance limiter for public form endpoints. Good enough to
// stop accidental double-submits and casual spam; use a shared store (Redis,
// Upstash) if the site runs on many instances.
const hits = new Map<string, number[]>();

export function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    throw new RateLimitError("Too many requests. Please try again in a few minutes.");
  }
  recent.push(now);
  hits.set(key, recent);
}
