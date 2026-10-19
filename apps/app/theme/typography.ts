import type { TextStyle } from "react-native";

// Two families matching the two halves of the logo:
// Bimbo (hand-written "mile") — shipped as Borel, its closest open-licence
// match — for short lowercase lines; Archivo ("PAW") for everything else.
// Archivo Expanded in caps carries labels and buttons.
export const fontAssets = {
  "Archivo-Light": require("@/assets/fonts/Archivo-Light.ttf"),
  "Archivo-Regular": require("@/assets/fonts/Archivo-Regular.ttf"),
  "Archivo-Medium": require("@/assets/fonts/Archivo-Medium.ttf"),
  "Archivo-SemiBold": require("@/assets/fonts/Archivo-SemiBold.ttf"),
  "Archivo-Bold": require("@/assets/fonts/Archivo-Bold.ttf"),
  "ArchivoExpanded-SemiBold": require("@/assets/fonts/ArchivoExpanded-SemiBold.ttf"),
  "ArchivoExpanded-Bold": require("@/assets/fonts/ArchivoExpanded-Bold.ttf"),
  "ArchivoExpanded-ExtraBold": require("@/assets/fonts/ArchivoExpanded-ExtraBold.ttf"),
  "Borel-Regular": require("@/assets/fonts/Borel-Regular.ttf"),
};

export const fonts = {
  light: "Archivo-Light",
  regular: "Archivo-Regular",
  medium: "Archivo-Medium",
  semibold: "Archivo-SemiBold",
  bold: "Archivo-Bold",
  expandedSemibold: "ArchivoExpanded-SemiBold",
  expandedBold: "ArchivoExpanded-Bold",
  expandedExtraBold: "ArchivoExpanded-ExtraBold",
  script: "Borel-Regular",
};

type Variant =
  | "display"
  | "headline"
  | "script"
  | "titleLg"
  | "title"
  | "titleSm"
  | "label"
  | "body"
  | "bodyStrong"
  | "bodySm"
  | "caption"
  | "price"
  | "button";

// Borel's tall ascenders need generous line heights to avoid clipping.
export const type: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.script, fontSize: 44, lineHeight: 64 },
  headline: { fontFamily: fonts.script, fontSize: 32, lineHeight: 48 },
  script: { fontFamily: fonts.script, fontSize: 22, lineHeight: 34 },
  titleLg: { fontFamily: fonts.expandedExtraBold, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  title: { fontFamily: fonts.expandedBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  titleSm: { fontFamily: fonts.expandedBold, fontSize: 15, lineHeight: 20 },
  label: {
    fontFamily: fonts.expandedBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  bodySm: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17 },
  price: { fontFamily: fonts.expandedExtraBold, fontSize: 22, lineHeight: 26, letterSpacing: -0.4 },
  button: {
    fontFamily: fonts.expandedBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
};

export type TypeVariant = Variant;
