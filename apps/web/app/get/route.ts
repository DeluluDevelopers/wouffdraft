import { NextRequest, NextResponse } from "next/server";
import { site } from "../lib/site";

// "Get the app" link: sends phones to their store, everyone else to the
// download section of the landing page.
export function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? "";
  const isApple = /iPhone|iPad|iPod|Macintosh.*Mobile/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (isApple && site.appStoreUrl) {
    return NextResponse.redirect(site.appStoreUrl);
  }
  if (isAndroid) {
    return NextResponse.redirect(site.playStoreUrl);
  }
  return NextResponse.redirect(new URL("/#download", req.url));
}
