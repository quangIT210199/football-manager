import type { Metadata } from "next";

import { requireAdmin } from "@/lib/server/auth";
import { getTeamCounts } from "@/lib/server/teamStats";

export const metadata: Metadata = {
  title: "Quản trị",
};

export default async function AdminHomePage() {
  await requireAdmin();
  const counts = await getTeamCounts();
  const stats = [
    { label: "Cầu thủ", value: counts.players },
    { label: "Buổi đã đá", value: counts.finishedMatches },
  ];

  return (
    <div className="grid max-w-3xl gap-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-muted">Dữ liệu ở đây hiện trên trang công khai cho cả đội xem.</p>
      </header>
      <dl className="grid grid-cols-2 gap-3 sm:max-w-md">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</dt>
            <dd className="font-condensed text-4xl font-bold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
      {counts.players === 0 && (
        <p className="rounded-lg border border-dashed border-line bg-white p-4 text-sm text-muted">
          Chưa có cầu thủ nào. Mục quản lý cầu thủ sẽ xuất hiện ở menu bên trái trong bản cập nhật tới.
        </p>
      )}
    </div>
  );
}
