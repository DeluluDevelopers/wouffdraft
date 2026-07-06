import React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import type { IconProps } from "./ServiceIcons";

const base = (strokeWidth = 1.8) => ({
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth,
});

/** Calendar with a highlighted date range — multi-day booking entry point. */
export function CalendarRangeIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke={color} {...s} />
      <Path d="M3.5 9.5h17" stroke={color} {...s} />
      <Path d="M8 3v4M16 3v4" stroke={color} {...s} />
      <Rect x="7" y="12" width="10" height="4.5" rx="1.4" fill={color} stroke="none" />
    </Svg>
  );
}

/** Shopping cart — bulk-booking cart/review step. */
export function CartIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3.5 4.5h2.2l2.6 11.4h9.4l1.9-7.7H7" stroke={color} {...s} />
      <Circle cx="10" cy="19.3" r="1.4" stroke={color} {...s} />
      <Circle cx="17" cy="19.3" r="1.4" stroke={color} {...s} />
    </Svg>
  );
}

/** Vertical timeline with status dots — multi-day booking progress view. */
export function TimelineIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 5v14" stroke={color} {...s} />
      <Circle cx="6" cy="5" r="2" fill={color} stroke="none" />
      <Circle cx="6" cy="12" r="2" fill={color} stroke="none" />
      <Circle cx="6" cy="19" r="2" stroke={color} {...s} />
      <Path d="M11 5h9M11 12h9M11 19h9" stroke={color} {...s} />
    </Svg>
  );
}
