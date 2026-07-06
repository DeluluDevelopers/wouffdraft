import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./admin.css";
import { AdminProviders } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-admin-body",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-admin-heading",
});

export const metadata: Metadata = {
  title: "The Wouff — Admin",
  description: "Admin dashboard for The Wouff",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`admin-root ${nunito.variable} ${plusJakarta.variable}`}>
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
