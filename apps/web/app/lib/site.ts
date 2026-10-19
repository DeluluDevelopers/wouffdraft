// Business details used across the website. Values marked ASSUMPTION were not
// in the brief; confirm them before launch.
export const site = {
  name: "PawMile",
  tagline: "every walk counts",
  description:
    "Verified dog walkers, home visits, pet sitting and grooming at home. GPS-tracked walks with a photo report after every visit.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawmile.in", // ASSUMPTION: domain
  email: "hello@pawmile.in", // ASSUMPTION: support inbox
  careersEmail: "walkers@pawmile.in", // ASSUMPTION
  instagram: "https://instagram.com/thepawmile", // ASSUMPTION: handle
  supportHours: "Every day, 7 am – 9 pm",
  // ASSUMPTION: launch city and neighbourhoods.
  launchCity: "Bengaluru",
  liveAreas: [
    "Indiranagar",
    "Koramangala",
    "HSR Layout",
    "Jayanagar",
    "JP Nagar",
    "Whitefield",
    "Bellandur",
    "Hebbal",
    "Malleshwaram",
    "Sarjapur Road",
  ],
  waitlistCities: ["Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai"],
  legalName: "PawMile", // ASSUMPTION: registered entity name
  // Store listings the landing page sends visitors to. Android uses the
  // package id from apps/app/app.json; set the iOS link once the app is live.
  playStoreUrl:
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
    "https://play.google.com/store/apps/details?id=com.safalbhandari.app",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
} as const;
