import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Woff Admin",
  description: "Admin dashboard for Woff",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-root">{children}</div>;
}
