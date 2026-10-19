import Link from "next/link";
import { PawMark } from "./components/brand/PawMark";
import { siteFontClasses } from "./(marketing)/fonts";
import "./(marketing)/landing.css";

export default function NotFound() {
  return (
    <main
      className={siteFontClasses}
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <PawMark size={64} className="t-accent" />
        <p className="t-display" style={{ color: "var(--terracotta)", marginTop: 16 }}>
          lost the trail
        </p>
        <p className="t-muted" style={{ margin: "12px 0 28px" }}>
          This page wandered off. Let&apos;s head back home.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to PawMile
        </Link>
      </div>
    </main>
  );
}
