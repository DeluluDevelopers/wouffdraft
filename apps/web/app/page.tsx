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

export default function Home() {
  return (
    <div className={`${styles.page} ${neucha.variable} ${nunito.variable}`}>
      <main className={styles.main}>
        <Image
          src="/brand/wouff-logo-cream.png"
          alt="The Wouff"
          width={330}
          height={330}
          className={styles.logo}
          priority
        />

        <p className={styles.eyebrow}>Wouff Worthy</p>
        <h1 className={styles.heading}>Coming Soon</h1>

        <p className={styles.subheading}>
          Premium, boutique care for the heart of your home. We&apos;re getting
          everything ready. It won&apos;t be long.
        </p>
      </main>

      <footer className={styles.footer}>
        The Wouff · For the heart of your home
      </footer>
    </div>
  );
}
