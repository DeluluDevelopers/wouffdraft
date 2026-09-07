import Image from "next/image";
import { Neucha, Nunito } from "next/font/google";
import styles from "./page.module.css";

const neucha = Neucha({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-neucha",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c.7 6.2 5.1 10.6 12 12-6.9 1.4-11.3 5.8-12 12-.7-6.2-5.1-10.6-12-12C6.9 10.6 11.3 6.2 12 0z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className={`${styles.page} ${neucha.variable} ${nunito.variable}`}>
      <div className={styles.glowOne} aria-hidden />
      <div className={styles.glowTwo} aria-hidden />

      <main className={styles.main}>
        <div className={styles.logoWrap}>
          <Sparkle className={styles.sparkleLeft} />
          <Image
            src="/brand/wouff-logo-cream.png"
            alt="The Wouff"
            width={200}
            height={200}
            className={styles.logo}
            priority
          />
          <Sparkle className={styles.sparkleRight} />
        </div>

        <p className={styles.eyebrow}>Wouff Worthy</p>
        <h1 className={styles.heading}>Coming Soon</h1>

        <p className={styles.subheading}>
          Premium, boutique care for the heart of your home. We&apos;re getting
          everything ready — it won&apos;t be long.
        </p>

        <div className={styles.rule} aria-hidden>
          <span className={styles.ruleLine} />
          <Sparkle className={styles.ruleSparkle} />
          <span className={styles.ruleLine} />
        </div>
      </main>

      <footer className={styles.footer}>
        The Wouff · For the heart of your home
      </footer>
    </div>
  );
}
