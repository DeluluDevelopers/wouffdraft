import { TextStyle } from "react-native";

/**
 * Triple-font system: Neucha (hand-lettered display, ≤3 words, uppercase),
 * Nunito (body copy), Plus Jakarta Sans (labels & sub-headings — stands in
 * for the licensed "Providence Sans Pro").
 */
export const Fonts = {
  display: "Neucha_400Regular",
  body: "Nunito_400Regular",
  bodyMedium: "Nunito_600SemiBold",
  bodyBold: "Nunito_700Bold",
  label: "PlusJakartaSans_600SemiBold",
  labelBold: "PlusJakartaSans_700Bold",
  labelExtraBold: "PlusJakartaSans_800ExtraBold",
};

type Style = Pick<
  TextStyle,
  | "fontFamily"
  | "fontSize"
  | "lineHeight"
  | "letterSpacing"
  | "textTransform"
>;

const Typography: Record<string, Style> = {
  displayLg: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 44,
    textTransform: "uppercase",
  },
  displayMd: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
    textTransform: "uppercase",
  },
  headlineLg: {
    fontFamily: Fonts.labelExtraBold,
    fontSize: 24,
    lineHeight: 30,
  },
  headlineMd: {
    fontFamily: Fonts.labelBold,
    fontSize: 20,
    lineHeight: 26,
  },
  titleMd: {
    fontFamily: Fonts.labelBold,
    fontSize: 16,
    lineHeight: 22,
  },
  bodyLg: {
    fontFamily: Fonts.body,
    fontSize: 17,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  bodySm: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  labelCaps: {
    fontFamily: Fonts.labelBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
};

export default Typography;
