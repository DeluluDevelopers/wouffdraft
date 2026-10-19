import { site } from "../../lib/site";
import styles from "./StoreButtons.module.css";

function PlayGlyph() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true">
      <path d="M1.5 1.2 12.6 12 1.5 22.8c-.3-.2-.5-.6-.5-1.1V2.3c0-.5.2-.9.5-1.1Z" fill="#a8c4bb" />
      <path d="M16.3 8.3 12.6 12 1.5 1.2c.4-.3 1-.3 1.6 0l13.2 7.1Z" fill="#e6b460" />
      <path d="M16.3 15.7 3.1 22.8c-.6.3-1.2.3-1.6 0L12.6 12l3.7 3.7Z" fill="#cc5c4b" />
      <path d="m20.2 10.4-3.9-2.1L12.6 12l3.7 3.7 3.9-2.1c1.2-.7 1.2-2.5 0-3.2Z" fill="#91a26b" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="1.5" width="14" height="21" rx="3.5" />
      <path d="M8 19h4" strokeLinecap="round" />
    </svg>
  );
}

// Store links for the PawMile app. The iOS button shows "coming soon" until
// NEXT_PUBLIC_APP_STORE_URL is set.
export function StoreButtons({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const className = `${styles.store} ${tone === "light" ? styles.light : ""}`;
  return (
    <div className={styles.row}>
      <a className={className} href={site.playStoreUrl} target="_blank" rel="noreferrer">
        <PlayGlyph />
        <span>
          <small>Get it on</small>
          Google Play
        </span>
      </a>
      {site.appStoreUrl ? (
        <a className={className} href={site.appStoreUrl} target="_blank" rel="noreferrer">
          <PhoneGlyph />
          <span>
            <small>Download on the</small>
            App Store
          </span>
        </a>
      ) : (
        <span className={`${className} ${styles.soon}`} aria-label="iPhone app coming soon">
          <PhoneGlyph />
          <span>
            <small>iPhone app</small>
            Coming soon
          </span>
        </span>
      )}
    </div>
  );
}
