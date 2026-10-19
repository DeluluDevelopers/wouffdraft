import { PawMark } from "../brand/PawMark";
import styles from "./RouteMap.module.css";

type RouteMapProps = {
  route: [number, number][];
  className?: string;
  label?: string;
};

const W = 320;
const H = 200;
const PAD = 26;

// Projects [lat, lng] pairs into the SVG box, keeping the route's aspect ratio.
function project(route: [number, number][]) {
  const lats = route.map(([lat]) => lat);
  const lngs = route.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  // Longitude degrees shrink with latitude.
  const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = Math.max((maxLng - minLng) * lngScale, 1e-6);
  const spanY = Math.max(maxLat - minLat, 1e-6);
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const offsetX = (W - spanX * scale) / 2;
  const offsetY = (H - spanY * scale) / 2;
  return route.map(([lat, lng]) => [
    offsetX + (lng - minLng) * lngScale * scale,
    offsetY + (maxLat - lat) * scale,
  ]);
}

// Smooths the polyline with quadratic curves through segment midpoints.
function toPath(points: number[][]) {
  if (points.length < 2) return "";
  const [first, ...rest] = points;
  let d = `M${first![0]!.toFixed(1)} ${first![1]!.toFixed(1)}`;
  for (let i = 0; i < rest.length - 1; i++) {
    const [x, y] = rest[i]!;
    const [nx, ny] = rest[i + 1]!;
    d += ` Q${x!.toFixed(1)} ${y!.toFixed(1)} ${((x! + nx!) / 2).toFixed(1)} ${((y! + ny!) / 2).toFixed(1)}`;
  }
  const last = rest[rest.length - 1]!;
  d += ` L${last[0]!.toFixed(1)} ${last[1]!.toFixed(1)}`;
  return d;
}

export function RouteMap({ route, className, label = "Walk route" }: RouteMapProps) {
  if (route.length < 2) return null;
  const points = project(route);
  const start = points[0]!;
  const end = points[points.length - 1]!;
  const d = toPath(points);

  return (
    <div className={`${styles.map} ${className ?? ""}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
        <rect width={W} height={H} className={styles.ground} />
        {/* Stylised streets and a park so the route has context. */}
        <rect x="196" y="18" width="92" height="64" rx="14" className={styles.park} />
        <circle cx="70" cy="160" r="26" className={styles.park} />
        <g className={styles.streets}>
          <path d="M-10 52 H330" />
          <path d="M-10 118 C80 112 160 128 330 116" />
          <path d="M-10 176 H330" />
          <path d="M44 -10 V210" />
          <path d="M128 -10 C122 70 136 140 128 210" />
          <path d="M226 -10 V210" />
          <path d="M296 -10 V210" />
        </g>
        <path d={d} className={styles.routeShadow} />
        <path d={d} className={styles.route} pathLength={1} />
        <circle cx={start[0]} cy={start[1]} r="7" className={styles.start} />
        <circle cx={start[0]} cy={start[1]} r="3" className={styles.startDot} />
        <g transform={`translate(${end[0]! - 13} ${end[1]! - 32})`}>
          <path d="M13 32 C13 32 0 20 0 12 A13 13 0 0 1 26 12 C26 20 13 32 13 32Z" className={styles.pin} />
          <g transform="translate(6.5 4.2)" className={styles.pinPaw}>
            <PawMark size={13} />
          </g>
        </g>
      </svg>
    </div>
  );
}
