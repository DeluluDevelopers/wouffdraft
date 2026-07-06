import React from "react";
import Svg, { Path, Circle, Ellipse, Line } from "react-native-svg";

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const base = (strokeWidth = 1.8) => ({
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth,
});

/** Bathtub with suds — grooming bath / wash service. */
export function BathingIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 12h18v2.5a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 14.5V12Z"
        stroke={color}
        {...s}
      />
      <Path d="M3 12V9.5A2.5 2.5 0 0 1 5.5 7" stroke={color} {...s} />
      <Path d="M6 19.5v1.2M17.5 19.5v1.2" stroke={color} {...s} />
      <Path
        d="M8 4.2c-.9.5-1.1 1.5-.5 2.3.6.8 0 1.5-.7 1.5"
        stroke={color}
        {...s}
      />
      <Path
        d="M12 3.7c-.9.5-1.1 1.5-.5 2.3.6.8 0 1.5-.7 1.5"
        stroke={color}
        {...s}
      />
      <Circle cx="16.2" cy="5.3" r="1.15" stroke={color} {...s} />
    </Svg>
  );
}

/** Grooming scissors — trim & cut service. */
export function CuttingIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="6" cy="6" r="2.2" stroke={color} {...s} />
      <Circle cx="6" cy="18" r="2.2" stroke={color} {...s} />
      <Path d="M7.6 7.4 20 18" stroke={color} {...s} />
      <Path d="M7.6 16.6 20 6" stroke={color} {...s} />
    </Svg>
  );
}

/** Ear/eye hygiene — droplet with a paw print. */
export function HygieneIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3c3 3.6 5 6.6 5 9.3a5 5 0 1 1-10 0C7 9.6 9 6.6 12 3Z"
        stroke={color}
        {...s}
      />
      <Ellipse cx="12" cy="14.4" rx="1.35" ry="1.05" stroke={color} {...s} />
      <Ellipse cx="9.9" cy="12.6" rx="0.85" ry="0.65" stroke={color} {...s} />
      <Ellipse cx="14.1" cy="12.6" rx="0.85" ry="0.65" stroke={color} {...s} />
    </Svg>
  );
}

/** Blow dryer with airflow lines — dry & style service. */
export function BlowDryIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7.5 8.5h7a2.5 2.5 0 0 1 0 5h-7a2.5 2.5 0 0 1 0-5Z"
        stroke={color}
        {...s}
      />
      <Path d="M8.5 13 6.8 19.4a1 1 0 0 0 1.8.8L11 13.2" stroke={color} {...s} />
      <Path d="M17.5 6.5v4M19.5 8.5v3.5M15.8 9v2.5" stroke={color} {...s} />
    </Svg>
  );
}

/** Nail clipper — nail trim service. */
export function NailTrimIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 4c2 0 3.4 1.6 3.4 3.6 0 1.7-1 2.8-2 3.7"
        stroke={color}
        {...s}
      />
      <Path
        d="M12 4c-2 0-3.4 1.6-3.4 3.6 0 1.7 1 2.8 2 3.7"
        stroke={color}
        {...s}
      />
      <Path d="M9 11h6l-1.4 3.2a2 2 0 0 1-1.6 1H12a2 2 0 0 1-1.6-1L9 11Z" stroke={color} {...s} />
      <Path d="M12 15.2V20M9.2 20h5.6" stroke={color} {...s} />
    </Svg>
  );
}

/** Lotus flower — spa & relaxation service. */
export function SpaIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 20c-4-1.6-6-4.6-6-7.6C8.4 13 12 13.6 12 20Z" stroke={color} {...s} />
      <Path d="M12 20c4-1.6 6-4.6 6-7.6-2.4.6-6 1.2-6 7.6Z" stroke={color} {...s} />
      <Path d="M12 20V9.4" stroke={color} {...s} />
      <Path d="M12 9.4C10 8 8.8 5.8 9.4 3.4c2 .8 3.2 2.4 2.6 6Z" stroke={color} {...s} />
      <Path d="M12 9.4c2-1.4 3.2-3.6 2.6-6-2 .8-3.2 2.4-2.6 6Z" stroke={color} {...s} />
    </Svg>
  );
}

/** Spray bottle with sparkles — full cleaning service. */
export function CleaningIcon({ size = 28, color = "#2B2B2B", strokeWidth }: IconProps) {
  const s = base(strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 10h6v8.5A1.5 1.5 0 0 1 13.5 20h-3A1.5 1.5 0 0 1 9 18.5V10Z" stroke={color} {...s} />
      <Path d="M10.5 10V7.8h3V10" stroke={color} {...s} />
      <Path d="M10.8 7.8V6h2.4v1.8" stroke={color} {...s} />
      <Path d="M13.2 6h2.3l1.5-1.6" stroke={color} {...s} />
      <Path d="M4.2 6.4 5.6 5M4.4 9h2M5.4 12l1.4-1.2" stroke={color} {...s} />
    </Svg>
  );
}

/** 4-pointed sparkle — decorative brand motif (list bullets, accents). */
export function SparkleIcon({ size = 16, color = "#7F7FED" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2c.6 3.6 1.8 6.4 4.6 7.4-2.8 1-4 3.8-4.6 7.4-.6-3.6-1.8-6.4-4.6-7.4C10.2 8.4 11.4 5.6 12 2Z"
        fill={color}
      />
    </Svg>
  );
}

/** Paw print — decorative brand motif. */
export function PawIcon({ size = 16, color = "#7F7FED" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Ellipse cx="12" cy="15.5" rx="4.4" ry="3.6" fill={color} />
      <Ellipse cx="6.4" cy="11.6" rx="1.7" ry="2.1" fill={color} />
      <Ellipse cx="10.4" cy="8.4" rx="1.7" ry="2.1" fill={color} />
      <Ellipse cx="14.8" cy="8.4" rx="1.7" ry="2.1" fill={color} />
      <Ellipse cx="18.4" cy="11.8" rx="1.7" ry="2.1" fill={color} />
    </Svg>
  );
}

export const ServiceIcons: Record<string, React.ComponentType<IconProps>> = {
  Bathing: BathingIcon,
  Cutting: CuttingIcon,
  Hygiene: HygieneIcon,
  BlowDry: BlowDryIcon,
  NailTrim: NailTrimIcon,
  Spa: SpaIcon,
  Cleaning: CleaningIcon,
};
