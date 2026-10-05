import Link from "next/link";

import { PublicNavLink } from "@/app/(public)/_components/PublicNavLink";
import { ROUTES, TEAM_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: ROUTES.home, label: "Tổng quan" },
  { href: ROUTES.matches, label: "Trận đấu" },
];

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-blaugrana flex min-h-dvh flex-col text-chalk">
      <nav aria-label="Trang đội bóng" className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pt-4 sm:px-8">
        <Link href={ROUTES.home} className="font-display text-xl tracking-wide uppercase">
          {TEAM_NAME}
        </Link>
        <div className="flex gap-4">
          {NAV_ITEMS.map((item) => (
            <PublicNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>
      </nav>
      <div className="flex-1">{children}</div>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-xs text-chalk-dim sm:px-8">
        <span>© {TEAM_NAME}</span>
        <Link href={ROUTES.admin} className="hover:text-chalk">
          Quản trị
        </Link>
      </footer>
    </div>
  );
}
