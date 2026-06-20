---
name: Serene Paws
colors:
  surface: "#fbf9f8"
  surface-dim: "#dbd9d9"
  surface-bright: "#fbf9f8"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f5f3f3"
  surface-container: "#efeded"
  surface-container-high: "#eae8e7"
  surface-container-highest: "#e4e2e2"
  on-surface: "#1b1c1c"
  on-surface-variant: "#3f4848"
  inverse-surface: "#303030"
  inverse-on-surface: "#f2f0f0"
  outline: "#707978"
  outline-variant: "#bfc8c8"
  surface-tint: "#2a6767"
  primary: "#0c5252"
  on-primary: "#ffffff"
  primary-container: "#2d6a6a"
  on-primary-container: "#abe8e7"
  inverse-primary: "#95d1d1"
  secondary: "#5e5e5b"
  on-secondary: "#ffffff"
  secondary-container: "#e1dfdb"
  on-secondary-container: "#63635f"
  tertiary: "#54473b"
  on-tertiary: "#ffffff"
  tertiary-container: "#6d5f51"
  on-tertiary-container: "#eddac9"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#b1eeed"
  primary-fixed-dim: "#95d1d1"
  on-primary-fixed: "#002020"
  on-primary-fixed-variant: "#074f4f"
  secondary-fixed: "#e4e2dd"
  secondary-fixed-dim: "#c8c6c2"
  on-secondary-fixed: "#1b1c19"
  on-secondary-fixed-variant: "#474744"
  tertiary-fixed: "#f3dfce"
  tertiary-fixed-dim: "#d6c3b3"
  on-tertiary-fixed: "#231a0f"
  on-tertiary-fixed-variant: "#514538"
  background: "#fbf9f8"
  on-background: "#1b1c1c"
  surface-variant: "#e4e2e2"
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 20px
  gutter-md: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style

The design system focuses on creating a sense of calm and reliability for pet owners. It utilizes a **Minimalist** foundation blended with **Soft Tactile** elements to feel approachable rather than clinical. The visual narrative is built around "Gentle Care"—using generous whitespace to reduce cognitive load during the booking process and a soft color palette to evoke warmth.

The target audience consists of busy pet parents who value ease of use and professional quality. The UI should feel like a premium boutique service: clean, airy, and effortlessly organized.

## Colors

The palette is anchored in organic, soothing tones.

- **Primary (Gentle Teal):** Used for critical actions like "Book Now" and active navigation states. It provides a professional, trustworthy anchor.
- **Secondary (Soft Cream):** The primary background color. It is warmer and more inviting than pure white, reducing eye strain.
- **Tertiary (Warm Sand):** Used for subtle accents, secondary buttons, or decorative elements that need to feel soft.
- **Neutral (Warm Gray):** Used for typography and iconography to maintain high legibility without the harshness of pure black.
- **Success/Alert:** Soft sage for success messages and a muted terracotta for errors to maintain the gentle aesthetic.

## Typography

**Plus Jakarta Sans** is the sole typeface for this design system. Its modern, slightly rounded geometric forms strike the perfect balance between professional SaaS and friendly consumer apps.

Headlines use tighter letter spacing and heavier weights to create clear entry points for the eye. Body text maintains a generous line height (1.5x) to ensure the interface feels breezy and easy to scan, even when containing detailed service descriptions or pet medical info.

## Layout & Spacing

The system utilizes a **Fluid Grid** for mobile, with a standard 4-column layout for internal card structures. A base-8 spacing scale ensures vertical rhythm.

- **Safe Areas:** 20px horizontal margins on mobile to ensure content doesn't feel cramped against the screen edges.
- **Service Cards:** Use a 16px gutter between horizontal service options (Cutting, Bathing, Hygiene).
- **Sectioning:** Large 40px gaps between major logical blocks (e.g., Header vs. Service Grid) to emphasize the minimalist aesthetic.
- **Touch Targets:** All interactive elements maintain a minimum 48px height/width.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Ambient Shadows** rather than harsh borders.

- **Surface 1 (Background):** Soft Cream (#F9F7F2).
- **Surface 2 (Cards/Modals):** Pure White (#FFFFFF). This creates a subtle lift against the cream background.
- **Shadows:** Use a "Soft Bloom" shadow for cards: `0px 4px 20px rgba(45, 106, 106, 0.05)`. The hint of primary teal in the shadow color makes the elevation feel integrated with the brand.
- **Interactive Depth:** When a service card is selected, it should transition from a soft shadow to a subtle inner glow or a 2px primary-colored border to indicate focus.

## Shapes

The shape language is **Rounded**, reflecting the soft and friendly nature of pets.

- **Standard Cards:** Use `rounded-lg` (16px) to feel substantial yet soft.
- **Buttons:** Use `rounded-xl` (24px) or full pill-shape for primary actions to make them feel "clickable" and friendly.
- **Form Inputs:** Use `rounded-md` (8px) to maintain a slightly more structured and professional look for data entry.

## Components

- **Primary Buttons:** High-contrast Teal background with White text. Use 16px vertical padding. Elevation should increase slightly on tap.
- **Service Chips:** These represent "Cutting", "Bathing", etc. They use a white background with a thin teal border when unselected, and flip to a solid teal background with white text when active.
- **Form Inputs:** Transparent or very light gray backgrounds with a bottom-only border or soft 4-sided stroke. Labels should always be visible (never placeholder-only) for accessibility.
- **Service Cards:** Large, white, rounded rectangles with centered iconography. Titles are placed below the icon in `label-md`.
- **Navigation Bar:** A fixed bottom bar using a blur effect (Glassmorphism) over the background. Icons use the primary teal for active states and warm gray for inactive.
- **Modals/Sheets:** Use "Bottom Sheets" for scheduling and service submission. They should have a 32px top-corner radius and a visible drag handle at the top.
