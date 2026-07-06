"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OverviewIcon, UsersIcon, BookingsIcon, ServicesIcon, LogoutIcon } from "./icons";

const links = [
  { href: "/admin", label: "Overview", icon: OverviewIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/bookings", label: "Bookings", icon: BookingsIcon },
  { href: "/admin/service-options", label: "Service catalog", icon: ServicesIcon },
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
      <div className="admin-brand">
        <Image src="/brand/wouff-mark.png" alt="The Wouff" width={32} height={32} />
        <div className="admin-brand-text">
          The Wouff
          <span>Admin</span>
        </div>
      </div>
      <nav className="admin-nav">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
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
              <Icon size={17} color="currentColor" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        className="admin-button admin-button-secondary admin-button-block"
        onClick={handleLogout}
      >
        <LogoutIcon size={15} color="currentColor" />
        Log out
      </button>
    </aside>
  );
}
