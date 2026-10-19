import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  block?: boolean;
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", block = false) {
  return ["btn", `btn-${variant}`, size !== "md" ? `btn-${size}` : "", block ? "btn-block" : ""]
    .filter(Boolean)
    .join(" ");
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  block = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link {...props} className={[buttonClass(variant, size, block), className].filter(Boolean).join(" ")}>
      {children}
      {arrow ? <Icon name="arrow-right" size={18} className="btn-arrow" /> : null}
    </Link>
  );
}
