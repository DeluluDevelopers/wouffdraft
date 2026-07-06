import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import type { IconProps } from "./ServiceIcons";
import { PawIcon } from "./ServiceIcons";

export function HomeIcon({ size = 24, color = "#2B2B2B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3.6 3.5 10.8a1 1 0 0 0 .65 1.76H5V20a1 1 0 0 0 1 1h3.4a1 1 0 0 0 1-1v-4.6h3.2V20a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-7.44h.85a1 1 0 0 0 .65-1.76L12 3.6Z"
        fill={color}
      />
    </Svg>
  );
}

export function CalendarIcon({ size = 24, color = "#2B2B2B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="6" y="3" width="2" height="4" rx="1" fill={color} />
      <Rect x="16" y="3" width="2" height="4" rx="1" fill={color} />
      <Path
        d="M4.5 5.5h15A1.5 1.5 0 0 1 21 7v11.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5V7a1.5 1.5 0 0 1 1.5-1.5Z"
        fill={color}
      />
    </Svg>
  );
}

export const ProfileTabIcon = PawIcon;
