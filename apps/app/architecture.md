# Architecture — `apps/app`

This document explains the role of every file and folder in this Expo app, from bottom to top.

---

## Configuration Files

| File | Purpose |
|---|---|
| `package.json` | Entry point is `expo-router/entry` — not a manual `App.js`. Expo Router auto-discovers the `app/` directory at boot. Dependencies include `expo-router`, `react-native-reanimated`, `expo-splash-screen`, `react-native-safe-area-context`, `expo-font`, `expo-symbols`, `expo-linking`, `expo-web-browser`, and `react-native-web`. |
| `app.json` | Expo config: portrait lock, automatic light/dark mode, deep-link scheme (`app`), typed routes enabled, splash screen plugin, adaptive Android icons with a light-blue background. |
| `tsconfig.json` | Extends `expo/tsconfig.base`, strict mode on, `@/*` alias → `./*`. |
| `expo-env.d.ts` | Auto-generated reference to Expo's ambient type declarations. |
| `AGENTS.md` / `CLAUDE.md` | Direct AI coding assistants to read **versioned Expo docs** before writing code. |

---

## `app/` — File-Based Routing (Expo Router)

Expo Router maps the filesystem directly to routes. Every file under `app/` becomes a screen.

### Root Layout: `_layout.tsx`

The entry layout that wraps every screen. It does three things:

1. **Boot sequence** — Loads the SpaceMono font on launch. Prevents the splash screen from hiding until fonts are ready, so the user never sees a flash of unstyled text.
2. **Theme provider** — Reads the system color scheme (light/dark) and wraps the app in React Navigation's `DefaultTheme` or `DarkTheme`.
3. **Stack navigator** — Defines two screens:
   - `(tabs)` — the tab group (header hidden because tabs have their own headers).
   - `modal` — presented as a modal (slides up from bottom on iOS).

The `ErrorBoundary` export lets `expo-router` catch navigation errors gracefully.

### Route Group: `(tabs)/`

A route group — the parentheses mean it doesn't add a segment to the URL path. It groups the tab screens together.

- **`_layout.tsx`** — Bottom tab navigator with two tabs: **Tab One** and **Tab Two**. Uses `expo-symbols` for icons (SF Symbols on iOS, Material icon fallback on Android/Web). The header is hidden during SSR with `useClientOnlyValue` to prevent hydration mismatches on web.
- **`index.tsx`** — Tab One's default screen.
- **`two.tsx`** — Tab Two's screen.

### Other Routes

- **`modal.tsx`** — A modal-presented info screen reachable from Tab One's header-right button.
- **`+not-found.tsx`** — Catch-all 404 screen for unmatched routes.
- **`+html.tsx`** — Web-only: customizes the root HTML document (disables body scrolling, injects dark-mode inline CSS to prevent flash on load).

---

## `components/` — Reusable UI

| Component | Purpose |
|---|---|
| `Themed.tsx` | `<Text>` and `<View>` wrappers that auto-apply light/dark colors from the `Colors` constants. Accepts optional `lightColor`/`darkColor` props. |
| `StyledText.tsx` | A `<Text>` wrapper hard-coded to the SpaceMono font. Used by `EditScreenInfo` for code-path display. |
| `EditScreenInfo.tsx` | Template boilerplate — shows the current screen's file path and edit instructions. Will be replaced by real app content. |
| `ExternalLink.tsx` | Opens URLs in the in-app browser (`expo-web-browser`) on native, new tab on web. Wraps Expo Router's `<Link>` with `target="_blank"`. |
| `useColorScheme.ts` / `.web.ts` | Platform-aware hook. Native: wraps RN's `useColorScheme` (defaults to `"dark"` on Android's `"unspecified"`). Web: always returns `"light"` (SSR-safe). |
| `useClientOnlyValue.ts` / `.web.ts` | Returns a server value during SSR, then swaps to the client value after hydration. Native version returns client value immediately. Used to suppress hydration mismatches on web. |

---

## `constants/` — Shared Values

- **`Colors.ts`** — Light and dark theme palettes. Light: black text, white bg, blue tint (`#2f95dc`). Dark: white text, black bg, white tint. Referenced by `Themed.tsx` and the tab layout.

---

## `assets/` — Media

| Path | Purpose |
|---|---|
| `fonts/SpaceMono-Regular.ttf` | Custom monospace font loaded at startup. |
| `images/icon.png` | App icon (iOS / default). |
| `images/splash-icon.png` | Splash screen image. |
| `images/favicon.png` | Browser favicon (web). |
| `images/android-icon-*.png` | Android adaptive icon layers (foreground, background `#E6F4FE`, monochrome). |

---

## Data Flow Summary

```
Boot → _layout.tsx loads font + hides splash
      → ThemeProvider wraps the app
          → Stack navigator renders:
              → (tabs) tab navigator
                  → index.tsx (Tab One)
                  → two.tsx (Tab Two)
              → modal.tsx (presented as modal)
                  → +not-found.tsx (404 catch-all)
```

The app is currently in its **scaffolded template state** (default Expo Router tabs template). All screens are empty placeholders ready to be replaced with real features.
