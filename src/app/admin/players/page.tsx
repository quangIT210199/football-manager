import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { PlayersTable } from "@/app/admin/players/_components/PlayersTable";
import { getButtonClassName } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { listPlayers } from "@/lib/server/players";
import { sortPlayersByPosition } from "@/lib/utils/position";

export const metadata: Metadata = {
  title: "Cầu thủ",
};

export default async function AdminPlayersPage() {
  await requireAdmin();
  const players = sortPlayersByPosition(await listPlayers());
  const activeCount = players.filter((player) => player.is_active).length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Cầu thủ"
        description={`${activeCount} đang tham gia · ${players.length - activeCount} đã ẩn`}
        actions={
          <Link href={ROUTES.adminNewPlayer} className={getButtonClassName("primary")}>
            Thêm cầu thủ
          </Link>
        }
      />
      {players.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white p-6 text-sm text-muted">
          Chưa có cầu thủ nào. Bấm <strong>Thêm cầu thủ</strong> để tạo người đầu tiên.
        </p>
      ) : (
        <PlayersTable players={players} />
      )}
    </div>
  );
}
