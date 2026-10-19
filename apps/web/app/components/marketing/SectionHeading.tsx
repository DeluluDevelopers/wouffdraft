import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  label?: string;
  script?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
};

// Leads with one short hand-written line, then switches to Archivo.
export function SectionHeading({
  label,
  script,
  title,
  intro,
  align = "left",
  tone = "light",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={[styles.wrap, align === "center" ? styles.center : "", tone === "dark" ? styles.dark : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.text}>
        {label ? <p className={`t-label ${styles.label}`}>{label}</p> : null}
        {script ? <p className={`t-headline ${styles.script}`}>{script}</p> : null}
        <h2 className={`t-title-lg ${styles.title}`}>{title}</h2>
        {intro ? <p className={`t-body-lg ${styles.intro}`}>{intro}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
