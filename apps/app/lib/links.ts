import * as WebBrowser from "expo-web-browser";

// Public website hosting the policies linked from the app and store listing.
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL ?? "https://woff-app-draft-web.vercel.app";

export function openLegal(doc: "terms" | "privacy" | "cancellation") {
  return WebBrowser.openBrowserAsync(`${WEBSITE_URL}/legal/${doc}`);
}
