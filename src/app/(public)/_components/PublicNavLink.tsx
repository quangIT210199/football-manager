"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/constants";

type PublicNavLinkProps = {
  href: string;
  label: string;
};

export function PublicNavLink({ href, label }: PublicNavLinkProps) {
  const pathname = usePathname();
  const isActive = href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`border-b-2 px-1 py-1 font-condensed text-sm font-bold tracking-[0.16em] uppercase ${
        isActive ? "border-gold text-chalk" : "border-transparent text-chalk-dim hover:text-chalk"
      }`}
    >
      {label}
    </Link>
  );
}
