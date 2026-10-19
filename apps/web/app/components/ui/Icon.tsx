import type { ReactNode } from "react";

// Line icons on a 24px grid, 1.75 stroke, round joins. Icons stay
// decorative unless a `label` is given.
const PATHS = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.8 2.8L16.2 9.6" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  "map-pin": (
    <>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.3 2.3 4.2-4.3" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  camera: (
    <>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8" />
    </>
  ),
  phone: (
    <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  chat: (
    <path d="M20 11.5c0 4.1-3.6 7.5-8 7.5-1.2 0-2.4-.2-3.4-.7L4 19.5l1.3-3.7A7.1 7.1 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5Z" />
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" />
      <path d="M9.5 20.5v-6h5v6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.8 19.5c.6-3.3 3-5.2 6.2-5.2s5.6 1.9 6.2 5.2" />
      <path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.6c2 .6 3.4 2.3 3.8 4.9" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
  ),
  paw: (
    <>
      <ellipse cx="7" cy="9.5" rx="1.8" ry="2.4" />
      <ellipse cx="10.4" cy="5.8" rx="1.8" ry="2.4" />
      <ellipse cx="14.4" cy="5.8" rx="1.8" ry="2.4" />
      <ellipse cx="17.6" cy="9.6" rx="1.8" ry="2.4" />
      <path d="M12.3 11.5c-2.6 0-5.3 3.7-5.3 6.1 0 1.6 1.1 2.4 2.5 2.4 1.2 0 1.8-.6 2.8-.6s1.6.6 2.8.6c1.4 0 2.5-.8 2.5-2.4 0-2.4-2.7-6.1-5.3-6.1Z" />
    </>
  ),
  leash: (
    <>
      <path d="M5 4c3 0 4 2.5 4 5s1.5 6 5 6" />
      <circle cx="17" cy="16.5" r="3" />
      <path d="M5 4v3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5 8 8 0 1 0 19.5 14.5Z" />,
  rain: (
    <>
      <path d="M7 15.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.4 1.7 3.7 3.7 0 0 1-.5 7.3H7Z" />
      <path d="m8.5 18.5-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2" />
    </>
  ),
  thermometer: (
    <>
      <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z" />
      <path d="M12 9v6" />
    </>
  ),
  droplet: <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />,
  bowl: (
    <>
      <path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M8 7.5c0-1 .8-1.5.8-2.5M12 7.5c0-1 .8-1.5.8-2.5M16 7.5c0-1 .8-1.5.8-2.5" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6.5" cy="7" r="2.6" />
      <circle cx="6.5" cy="17" r="2.6" />
      <path d="M8.7 8.4 20 17M8.7 15.6 20 7" />
    </>
  ),
  bath: (
    <>
      <path d="M3 12h18v2.5A5.5 5.5 0 0 1 15.5 20h-7A5.5 5.5 0 0 1 3 14.5V12Z" />
      <path d="M6 12V6a2 2 0 0 1 3.7-1M7 20l-1 1.5M17 20l1 1.5" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5ZM18.5 15.5c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7Z" />
  ),
  "id-card": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.3" />
      <path d="M5.5 16.5c.5-1.6 1.8-2.5 3.5-2.5s3 .9 3.5 2.5M14.5 9.5H18M14.5 13H18" />
    </>
  ),
  graduation: (
    <>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v4.5c1.4 1.4 3.4 2 5.5 2s4.1-.6 5.5-2V11M21.5 9v5" />
    </>
  ),
  footprints: (
    <>
      <path d="M5.5 15.5c-1-2.5-1.5-5.3-.4-7.3.9-1.6 3-1.6 3.6.2.6 2-.3 4.6-.4 7.1H5.5ZM5.6 17.5h2.7c.2 1.6-.4 3-1.5 3s-1.4-1.4-1.2-3Z" />
      <path d="M18.5 10.5c1-2.5 1.5-5.3.4-7.3-.9-1.6-3-1.6-3.6.2-.6 2 .3 4.6.4 7.1h2.8ZM18.4 12.5h-2.7c-.2 1.6.4 3 1.5 3s1.4-1.4 1.2-3Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  rupee: <path d="M7 5h10M7 9h10M10.5 5c5 0 5 8 0 8H7l7.5 7" />,
  refresh: (
    <>
      <path d="M20 11.5A8 8 0 0 0 5.6 7M4 12.5A8 8 0 0 0 18.4 17" />
      <path d="M5 3.5V7.5H9M19 20.5v-4h-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15l1.5-2Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5h3.5A2.5 2.5 0 0 1 20 7v10a2.5 2.5 0 0 1-2.5 2.5H14" />
      <path d="M10 8 6 12l4 4M6 12h10" />
    </>
  ),
  edit: <path d="M4.5 19.5 5 16 15.5 5.5a2.1 2.1 0 0 1 3 3L8 19l-3.5.5ZM13.5 7.5l3 3" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 21 19.5H3L12 4Z" />
      <path d="M12 10v4.5M12 17v.2" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 5 7 4.5 7 6.8 7 8.5 12 8.5 12 8.5ZM12 8.5c1.5-3.5 5-4 5-1.7 0 1.7-5 1.7-5 1.7Z" />
    </>
  ),
  building: (
    <>
      <path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 15 5v15.5M15 9.5h3.5A1.5 1.5 0 0 1 20 11v9.5M3.5 20.5h17" />
      <path d="M8.5 7.5h3M8.5 11h3M8.5 14.5h3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8v.2" />
    </>
  ),
  "first-aid": (
    <>
      <rect x="3.5" y="6.5" width="17" height="13" rx="2.5" />
      <path d="M9 6.5v-2h6v2M12 10v6M9 13h6" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16.5 6.5l2.5 2.5M14 9l2 2" />
    </>
  ),
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  swap: <path d="M7 7h12l-3-3M17 17H5l3 3" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5c.8 1.2 2 1.8 3.5 1.8s2.7-.6 3.5-1.8M9 9.5v.3M15 9.5v.3" />
    </>
  ),
  cat: (
    <>
      <path d="M5 20.5v-9L4 4l4.5 3.5h7L20 4l-1 7.5v9" />
      <path d="M5 20.5h14M9.5 13v.3M14.5 13v.3M11 16h2" />
    </>
  ),
  dog: (
    <>
      <path d="M8 5 4.5 6.5 4 11l3 1M16 5l3.5 1.5L20 11l-3 1" />
      <path d="M8 5h8l1 7v3.5a5 5 0 0 1-10 0V12l1-7Z" />
      <path d="M10 11v.3M14 11v.3M11 15h2l-1 1.2-1-1.2Z" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  wallet: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11V8" />
      <rect x="4" y="8" width="16.5" height="12" rx="2.5" />
      <path d="M16.5 14h.2" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, className, label, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
