import type { Metadata, Viewport } from "next";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { site } from "../lib/site";
import { siteFontClasses } from "./fonts";
import "./landing.css";

const adobeFontsKit = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "PawMile · Dog walkers & pet care at home",
    template: "%s · PawMile",
  },
  description: site.description,
  applicationName: "PawMile",
  icons: { icon: "/brand/pawmile-pawmark-terracotta.png" },
  openGraph: {
    type: "website",
    siteName: "PawMile",
    locale: "en_IN",
    title: "PawMile · every walk counts",
    description: site.description,
    images: [{ url: "/images/walk-golden-leash.jpg", width: 1800, height: 1252 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PawMile · every walk counts",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf6ea",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={siteFontClasses}>
      {adobeFontsKit ? (
        <link rel="stylesheet" href={`https://use.typekit.net/${adobeFontsKit}.css`} precedence="default" />
      ) : null}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
