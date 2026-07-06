---
name: Boutique Essential
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#161717'
  on-primary: '#ffffff'
  primary-container: '#2b2b2b'
  on-primary-container: '#939292'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5b'
  on-secondary: '#ffffff'
  secondary-container: '#e2e3dd'
  on-secondary-container: '#636560'
  tertiary: '#08005d'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1288'
  on-tertiary-container: '#8686f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1c1c'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e3dd'
  secondary-fixed-dim: '#c6c7c1'
  on-secondary-fixed: '#1a1c19'
  on-secondary-fixed-variant: '#454743'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c2c1ff'
  on-tertiary-fixed: '#0b006b'
  on-tertiary-fixed-variant: '#3937a3'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Neucha
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Neucha
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Providence Sans Pro
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Nunito
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Providence Sans Pro
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Neucha
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is built on a "Boutique Essential" narrative—blending indie-spirited artistry with premium, heart-centered care. The aesthetic is warm, artisanal, and conversational, aiming to evoke a sense of professional craftsmanship that feels hand-made and deeply connected to the pet-parent experience.

The visual style is **Modern Indie**. It utilizes a "warmly human" approach with organic, hand-drawn accents (like starbursts and textured underlines) paired against a sophisticated, dark-mode-leaning palette. It rejects the clinical utility of traditional pet care for an expressive, design-forward interface that feels like a curated lifestyle brand.

## Colors

The palette is anchored by a high-contrast foundation of **Off-Black (#2B2B2B)** and **Cream (#FFFFF9)**, moving away from sterile whites to create a more "bookish" and premium atmosphere. 

**Periwinkle (#7F7FED)** serves as the primary functional accent for actions and highlights. A secondary tier of "indie" pastels—**Lilac, Lemon, and Lime**—is used to categorize product ranges (e.g., Bath, Treats, Care) and add a playful, vibrant energy to illustrations and decorative UI elements.

## Typography

This design system uses a triple-font strategy to balance character with readability:
- **Neucha:** The primary display voice. Used for major headings and call-outs. Always used in uppercase to maintain a "hand-lettered poster" aesthetic.
- **Nunito:** The functional workhorse. Its rounded terminals mirror the soft edges of the brand's shape language. Used for all long-form body copy and descriptions.
- **Providence Sans Pro:** The secondary character voice. Used for shorter headings, sub-labels, and specific brand taglines. 

**Constraint:** Hand-written fonts (Neucha/Providence) must not be used for sentences longer than 3 words to ensure accessibility.

## Elevation & Depth

To maintain the "flat-art" indie aesthetic, traditional shadows are strictly avoided. Depth is communicated through:
- **Tonal Layering:** Using the dark #2B2B2B as a "base" and layering Cream or Periwinkle "cards" on top.
- **Graphic Borders:** Subtle 1px or 2px solid borders in a contrasting brand color are used instead of shadows to define container edges.
- **Texture:** Hand-drawn underlines and "crayon-style" textures provide a tactile feel that replaces the need for physical depth metaphors.

## Shapes

The shape language is organic and "soft-modern." 
- **Corners:** Components use a consistent 0.5rem (8px) radius to match the rounded terminals of the Nunito typeface.
- **Decorative Elements:** Incorporate the "sparkle/starburst" icon and "heart-center" motifs from the logo as floating decorative markers or bullet points.
- **Containers:** Large containers can occasionally use "blob" or organic wavy top-edges (as seen in the brand deck's usage examples) to break the rigidity of digital layouts.

## Components

### Buttons
Primary buttons are solid Periwinkle (#7F7FED) with Off-Black text in Providence Sans Pro (Uppercase). They should have a medium rounded corner (8px). Secondary buttons are outlined in Off-Black with a "hand-drawn" hover state.

### Cards
Cards use a Cream (#FFFFF9) background against the dark page background. They should not have shadows. Instead, use a simple 1px border or rely purely on color contrast.

### Input Fields
Fields are minimalist: a bottom-border only, using the "textured underline" style. Labels should use the `label-caps` typography style in Off-Black or Periwinkle.

### Chips & Tags
Used for product categories (e.g., "Bath," "Treats"). These should use the specific accent colors (Lilac, Lemon, Lime) with a slightly more aggressive 16px corner radius for a "friendly" feel.

### Lists
Bulleted lists should replace standard dots with the brand's 4-pointed sparkle icon in Lemon or Periwinkle.