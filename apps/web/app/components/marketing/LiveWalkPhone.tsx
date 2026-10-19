import Image from "next/image";
import { RouteMap } from "../report/RouteMap";
import { SAMPLE_ROUTE } from "../report/sampleRoute";
import { Icon } from "../ui/Icon";
import { PawMark } from "../brand/PawMark";
import styles from "./LiveWalkPhone.module.css";

// Illustrative phone screen showing a walk in progress.
export function LiveWalkPhone() {
  return (
    <div className={styles.phone} aria-label="Preview: following a walk live in PawMile" role="img">
      <div className={styles.screen}>
        <div className={styles.status}>
          <span>7:48</span>
          <span className={styles.island} />
          <span className={styles.signal} />
        </div>
        <div className={styles.appBar}>
          <PawMark size={22} className={styles.appPaw} />
          <div>
            <p className={styles.appTitle}>Bruno&apos;s walk</p>
            <p className={styles.live}>
              <span className={styles.liveDot} /> Live · 18 min in
            </p>
          </div>
        </div>
        <RouteMap route={SAMPLE_ROUTE.slice(0, 10)} className={styles.map} label="Live route so far" />
        <div className={styles.sheet}>
          <div className={styles.walker}>
            <div className={styles.avatar}>
              <Image src="/images/walk-street.jpg" alt="" fill sizes="44px" />
            </div>
            <div>
              <p className={styles.walkerName}>Priya is walking Bruno</p>
              <p className={styles.walkerMeta}>
                <Icon name="star" size={13} /> Verified walker · Indiranagar
              </p>
            </div>
          </div>
          <div className={styles.stats}>
            <div>
              <strong>1.6</strong>
              <span>km so far</span>
            </div>
            <div>
              <strong>12</strong>
              <span>min left</span>
            </div>
            <div>
              <strong>
                <Icon name="check" size={16} strokeWidth={2.4} />
              </strong>
              <span>pee break</span>
            </div>
          </div>
          <div className={styles.actions}>
            <span className={styles.action}>
              <Icon name="chat" size={16} /> Message
            </span>
            <span className={`${styles.action} ${styles.actionDark}`}>
              <Icon name="phone" size={16} /> Call support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
