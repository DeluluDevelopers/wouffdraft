import Image from "next/image";

type LogoVariant = "primary" | "horizontal" | "pawmark";
type LogoColour = "charcoal" | "biscuit" | "terracotta";

// Intrinsic artwork ratios from the supplied SVGs.
const RATIO: Record<LogoVariant, number> = {
  primary: 444.912 / 191.112,
  horizontal: 458.64 / 95.64,
  pawmark: 128.372 / 147.472,
};

type LogoProps = {
  variant?: LogoVariant;
  colour?: LogoColour;
  // Rendered width in px. Brand minimums on screen: primary 120, horizontal 140, paw mark 24.
  width: number;
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "horizontal",
  colour = "charcoal",
  width,
  className,
  priority,
}: LogoProps) {
  return (
    <Image
      src={`/brand/pawmile-${variant}-${colour}.svg`}
      alt="PawMile"
      width={width}
      height={Math.round(width / RATIO[variant])}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
