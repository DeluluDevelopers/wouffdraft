import Image from "next/image";
import { Baloo_2 } from "next/font/google";
import styles from "./page.module.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
});

export default function Home() {
  return (
    <div className={`${styles.page} ${baloo.variable}`}>
      <div className={styles.blobOne} aria-hidden />
      <div className={styles.blobTwo} aria-hidden />

      <main className={styles.main}>
        <Image
          src="/brand/wouff-mark.png"
          alt="The Wouff"
          width={110}
          height={107}
          className={styles.mark}
          priority
        />

        <Image
          src="/brand/wouff-wordmark.png"
          alt="The Wouff"
          width={260}
          height={75}
          className={styles.wordmark}
          priority
        />

        <h1 className={styles.heading}>Coming soon</h1>
        <p className={styles.subheading}>
          We&apos;re putting the finishing touches on a better way to care
          for your best friend. Won&apos;t be long now.
        </p>

        <div className={styles.pawDivider} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} The Wouff
      </footer>
    </div>
  );
}
