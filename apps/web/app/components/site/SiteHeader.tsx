"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "../brand/Logo";
import { buttonClass } from "../ui/ButtonLink";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="PawMile home">
          <Logo variant="horizontal" colour="charcoal" width={156} priority />
        </Link>
        <a href="/get" className={`${buttonClass("primary", "sm")} ${styles.cta}`}>
          Get the app
        </a>
      </div>
    </header>
  );
}
