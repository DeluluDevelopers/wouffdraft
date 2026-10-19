import Image from "next/image";
import { Icon, type IconName } from "../ui/Icon";
import { RouteMap } from "./RouteMap";
import styles from "./ReportCard.module.css";

export type ReportCardData = {
  petName: string;
  walkerName?: string | null;
  title?: string;
  dateLabel?: string;
  distanceMeters?: number | null;
  durationMinutes?: number | null;
  pee?: boolean;
  poo?: boolean;
  water?: boolean;
  fed?: boolean;
  mood?: string;
  note?: string;
  photoUrl?: string | null;
  route?: [number, number][] | null;
};

const MOOD_COPY: Record<string, string> = {
  Happy: "happy",
  Calm: "calm",
  Energetic: "zoomies",
  Anxious: "a bit unsure",
};

function formatKm(meters: number) {
  return (meters / 1000).toFixed(1);
}

export function ReportCard({ data, compact = false }: { data: ReportCardData; compact?: boolean }) {
  const checks: { key: string; label: string; icon: IconName; done?: boolean }[] = [
    { key: "pee", label: "Pee", icon: "droplet", done: data.pee },
    { key: "poo", label: "Poo", icon: "check", done: data.poo },
    { key: "water", label: "Water", icon: "bowl", done: data.water },
    { key: "fed", label: "Fed", icon: "heart", done: data.fed },
  ];

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ""}`} aria-label={`Visit report for ${data.petName}`}>
      <header className={styles.head}>
        <div>
          <p className={`t-label ${styles.kicker}`}>{data.title ?? "Walk report"}</p>
          <p className={styles.headline}>
            {data.petName}
            {data.mood ? <span className={styles.mood}>was {MOOD_COPY[data.mood] ?? data.mood.toLowerCase()}</span> : null}
          </p>
        </div>
        {data.dateLabel ? <span className={styles.date}>{data.dateLabel}</span> : null}
      </header>

      {data.route && data.route.length > 1 ? (
        <RouteMap route={data.route} className={styles.map} label={`Route walked with ${data.petName}`} />
      ) : null}

      <div className={styles.stats}>
        {data.distanceMeters != null ? (
          <div>
            <span className={`${styles.statValue} t-num`}>
              {formatKm(data.distanceMeters)}
              <small>km</small>
            </span>
            <span className={styles.statLabel}>Distance</span>
          </div>
        ) : null}
        {data.durationMinutes != null ? (
          <div>
            <span className={`${styles.statValue} t-num`}>
              {data.durationMinutes}
              <small>min</small>
            </span>
            <span className={styles.statLabel}>Time out</span>
          </div>
        ) : null}
        {data.photoUrl ? (
          <div className={styles.photo}>
            <Image
              src={data.photoUrl}
              alt={`${data.petName} during the visit`}
              fill
              sizes="96px"
              unoptimized={/^https?:/.test(data.photoUrl)}
            />
          </div>
        ) : null}
      </div>

      <ul className={styles.checks}>
        {checks.filter((check) => check.done !== undefined).map((check) => (
          <li key={check.key} className={check.done ? styles.done : styles.notDone}>
            <Icon name={check.done ? "check" : "minus"} size={14} strokeWidth={2.4} />
            {check.label}
          </li>
        ))}
      </ul>

      {data.note ? (
        <blockquote className={styles.note}>
          <p>{data.note}</p>
          {data.walkerName ? <footer>— {data.walkerName}, your walker</footer> : null}
        </blockquote>
      ) : null}
    </article>
  );
}
