"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/bookings", label: "Bookings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/v1/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Woff Admin</div>
      <nav className="admin-nav">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "admin-nav-link admin-nav-link-active"
                  : "admin-nav-link"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        className="admin-button admin-button-secondary admin-button-block"
        onClick={handleLogout}
      >
        Log out
      </button>
    </aside>
  );
}
