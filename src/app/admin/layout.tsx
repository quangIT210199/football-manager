import type { Metadata } from "next";

import { AdminSidebar } from "@/app/admin/_components/AdminSidebar";
import { requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-paper text-ink md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <AdminSidebar email={admin.email} />
      <main className="min-w-0 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
