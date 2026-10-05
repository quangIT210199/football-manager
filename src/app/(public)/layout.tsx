import Link from "next/link";

import { ROUTES, TEAM_NAME } from "@/lib/constants";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-blaugrana flex min-h-dvh flex-col text-chalk">
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
