import Image from "next/image";
import { StoreButtons } from "./StoreButtons";
import { PawMark } from "../brand/PawMark";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  script?: string;
  title?: string;
  text?: string;
};

export function CtaBand({
  script = "ready when they are",
  title = "Get PawMile and book a first walk in a minute",
  text = "Download the app, sign in with your phone number, add your dog and pick a slot. Free cancellation up to 2 hours before.",
}: CtaBandProps) {
  return (
    <section className={styles.section} id="download">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.copy}>
            <p className={`t-headline ${styles.script}`}>{script}</p>
            <h2 className={`t-title-lg ${styles.title}`}>{title}</h2>
            <p className={styles.text}>{text}</p>
            <div className={styles.actions}>
              <StoreButtons />
            </div>
          </div>
          <div className={styles.media} aria-hidden="true">
            <div className={styles.photo}>
              <Image src="/images/portrait-lab.jpg" alt="" fill sizes="(min-width: 900px) 30vw, 60vw" />
            </div>
            <PawMark size={92} className={styles.paw} />
          </div>
        </div>
      </div>
    </section>
  );
}
