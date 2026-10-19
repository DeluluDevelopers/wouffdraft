import { Archivo } from "next/font/google";
import localFont from "next/font/local";

// Archivo carries the steady "PAW" voice. The width axis gives us
// Archivo Expanded (font-stretch: 125%) for titles and labels.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Borel stands in for Bimbo (Adobe Fonts), the hand-written "mile" voice.
// Borel ships very tall vertical metrics, so they are tightened here.
// Set NEXT_PUBLIC_ADOBE_FONTS_KIT to load the licensed Bimbo instead.
export const borel = localFont({
  src: "../fonts/Borel-Regular.ttf",
  variable: "--font-borel",
  display: "swap",
  declarations: [
    { prop: "ascent-override", value: "108%" },
    { prop: "descent-override", value: "42%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

export const siteFontClasses = `pm-site ${archivo.variable} ${borel.variable}`;
