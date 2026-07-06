type IconProps = {
  size?: number;
  color?: string;
};

export function SearchIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={1.8} />
      <path d="M20 20 15.8 15.8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function OverviewIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" stroke={color} strokeWidth={1.8} />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" stroke={color} strokeWidth={1.8} />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" stroke={color} strokeWidth={1.8} />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

export function UsersIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth={1.8} />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M15.5 5.3a3.2 3.2 0 0 1 0 6.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M15 14.3c2.6.3 4.5 2.2 4.5 4.7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function BookingsIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke={color} strokeWidth={1.8} />
      <path d="M3.5 9.5h17" stroke={color} strokeWidth={1.8} />
      <path d="M8 3v4M16 3v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function PawIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <ellipse cx="12" cy="15.5" rx="4.4" ry="3.6" />
      <ellipse cx="6.4" cy="11.6" rx="1.7" ry="2.1" />
      <ellipse cx="10.4" cy="8.4" rx="1.7" ry="2.1" />
      <ellipse cx="14.8" cy="8.4" rx="1.7" ry="2.1" />
      <ellipse cx="18.4" cy="11.8" rx="1.7" ry="2.1" />
    </svg>
  );
}

export function ServicesIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path d="M12 3.5v3.2M20.5 12h-3.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

export function LogoutIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M15 16l4-4-4-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12H9" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
