import Link from "next/link";

import { signOut } from "@/app/admin/actions";
import { AdminNavLink } from "@/app/admin/_components/AdminNavLink";
import { Button } from "@/components/ui/Button";
import { ROUTES, TEAM_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: ROUTES.admin, label: "Tổng quan" },
  { href: ROUTES.adminPlayers, label: "Cầu thủ" },
];

type AdminSidebarProps = {
  email: string;
};

export function AdminSidebar({ email }: AdminSidebarProps) {
  return (
    <aside className="flex flex-col gap-3 border-b border-line bg-white px-3 py-4 md:min-h-dvh md:border-r md:border-b-0">
      <p className="px-3 font-display text-xl uppercase tracking-wide text-ink">
        {TEAM_NAME} <span className="font-condensed text-sm font-semibold tracking-[0.14em] text-blau">Admin</span>
      </p>
      <nav aria-label="Quản trị" className="flex gap-1 overflow-x-auto md:flex-col">
        {NAV_ITEMS.map((item) => (
          <AdminNavLink key={item.href} href={item.href} label={item.label} />
        ))}
        <Link
          href={ROUTES.home}
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink"
        >
          Xem trang công khai ↗
        </Link>
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-line px-3 pt-3 md:mt-auto md:flex-col md:items-start">
        <p className="truncate text-xs text-muted" title={email}>
          {email}
        </p>
        <form action={signOut}>
          <Button type="submit" variant="ghost" className="px-0 hover:bg-transparent">
            Đăng xuất
          </Button>
        </form>
      </div>
    </aside>
  );
}
