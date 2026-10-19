/**
 * PawMile palette (Brand Identity Guidelines, Oct 2026).
 * Core: Biscuit (ground ~50%), Charcoal (type ~25%), Terracotta (warmth ~15%).
 * Accents (~10%): Sage, Blush, Brick, Honey, Moss — for tags, icons and small
 * moments, never big backgrounds behind the logo.
 * The "Ink" variants are darker shades that pass WCAG AA (4.5:1) on Biscuit
 * for small text; brand colours stay for large type and fills.
 */
export const palette = {
  charcoal: "#2D2D2B",
  charcoal2: "#3A3A37",
  biscuit: "#FDF6EA",
  biscuit2: "#F6EAD5",
  biscuit3: "#EFE2CB",
  paper: "#FFFCF6",
  terracotta: "#C26641",
  terracottaInk: "#AD5734",
  terracottaDeep: "#9E4C2B",
  sage: "#A8C4BB",
  sageSoft: "#D8E6E0",
  blush: "#EAB6A1",
  blushSoft: "#F6DCD0",
  brick: "#CC5C4B",
  brickInk: "#B0473A",
  brickSoft: "#F9E1DC",
  honey: "#E6B460",
  honeySoft: "#F5DFB5",
  moss: "#91A26B",
  mossInk: "#5F7041",
  mossSoft: "#DFE5CF",
};

export const colors = {
  ...palette,
  background: palette.biscuit,
  surface: palette.paper,
  surfaceMuted: palette.biscuit2,
  text: palette.charcoal,
  textMuted: "#5C5A55",
  textSubtle: "#6B6862",
  placeholder: "#8A857C",
  line: "rgba(45,45,43,0.12)",
  lineStrong: "rgba(45,45,43,0.24)",
  primary: palette.terracottaInk,
  onPrimary: palette.biscuit,
  danger: palette.brickInk,
  success: palette.mossInk,
  overlay: "rgba(45,45,43,0.5)",
};

export type ColorName = keyof typeof colors;
