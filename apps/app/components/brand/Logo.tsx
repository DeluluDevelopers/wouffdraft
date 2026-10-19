import { Image, type ImageStyle, type StyleProp } from "react-native";

const SOURCES = {
  "primary-charcoal": require("@/assets/images/brand/pawmile-primary-charcoal.png"),
  "primary-biscuit": require("@/assets/images/brand/pawmile-primary-biscuit.png"),
  "horizontal-charcoal": require("@/assets/images/brand/pawmile-horizontal-charcoal.png"),
  "horizontal-biscuit": require("@/assets/images/brand/pawmile-horizontal-biscuit.png"),
};

const RATIO = {
  primary: 444.912 / 191.112,
  horizontal: 458.64 / 95.64,
};

type Props = {
  variant?: "primary" | "horizontal";
  colour?: "charcoal" | "biscuit";
  // Brand minimum on screen: primary 120px, horizontal 140px wide.
  width: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ variant = "primary", colour = "charcoal", width, style }: Props) {
  return (
    <Image
      source={SOURCES[`${variant}-${colour}`]}
      style={[{ width, height: width / RATIO[variant] }, style]}
      resizeMode="contain"
      accessibilityLabel="PawMile"
    />
  );
}
