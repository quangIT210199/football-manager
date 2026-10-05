"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/constants";

type AdminNavLinkProps = {
  href: string;
  label: string;
};

export function AdminNavLink({ href, label }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = href === ROUTES.admin ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
        isActive ? "bg-paper font-semibold text-ink" : "font-medium text-muted hover:bg-paper hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
