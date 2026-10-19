import Link from "next/link";
import { Logo } from "../brand/Logo";
import { PawMark } from "../brand/PawMark";
import { Icon } from "../ui/Icon";
import { site } from "../../lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brandCol}>
          <Logo variant="primary" colour="biscuit" width={190} />
          <p className={styles.blurb}>
            Trusted walkers and carers for the dogs and cats of {site.launchCity}. Every walk
            tracked, every visit reported.
          </p>
          <div className={styles.contact}>
            <a href={`mailto:${site.email}`} className={styles.contactLink}>
              <Icon name="mail" size={18} />
              {site.email}
            </a>
            <a href={site.instagram} className={styles.contactLink} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={18} />
              @thepawmile
            </a>
            <span className={styles.contactLink}>
              <Icon name="clock" size={18} />
              Support: {site.supportHours}
            </span>
          </div>
        </div>

      </div>

      <div className={`container ${styles.sign}`} aria-hidden="true">
        <span className={`t-script ${styles.signText}`}>every walk counts</span>
        <PawMark size={72} className={styles.signPaw} />
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {new Date().getFullYear()} {site.legalName}. Made with care in {site.launchCity}.
        </p>
        <div className={styles.legal}>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/cancellation">Cancellation & refunds</Link>
        </div>
      </div>
    </footer>
  );
}
