import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { ConfirmDeleteButton } from "@/app/admin/_components/ConfirmDeleteButton";
import { deletePlayer, updatePlayer } from "@/app/admin/players/actions";
import { PlayerForm } from "@/app/admin/players/_components/PlayerForm";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { getPlayer } from "@/lib/server/players";
import { getPlayerPhotoUrl } from "@/lib/utils/playerDisplay";

export const metadata: Metadata = {
  title: "Sửa cầu thủ",
};

export default async function EditPlayerPage({ params }: PageProps<"/admin/players/[playerId]">) {
  await requireAdmin();
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="grid gap-8">
      <AdminPageHeader title={player.full_name} back={{ href: ROUTES.adminPlayers, label: "Danh sách cầu thủ" }} />
      <PlayerForm
        action={updatePlayer.bind(null, player.id)}
        player={player}
        initialPhotoUrl={getPlayerPhotoUrl(player.photo_path)}
        submitLabel="Lưu thay đổi"
      />
      <section className="grid max-w-lg gap-3 border-t border-line pt-6">
        <h2 className="font-semibold">Xoá cầu thủ</h2>
        <p className="text-sm text-muted">
          Chỉ xoá được cầu thủ chưa từng ra sân. Người đã có dữ liệu trận đấu thì bỏ tick &quot;Đang tham gia&quot; để ẩn.
        </p>
        <ConfirmDeleteButton
          action={deletePlayer.bind(null, player.id)}
          triggerLabel="Xoá cầu thủ"
          confirmMessage={
            <>
              Xoá hẳn <strong>{player.full_name}</strong> và ảnh thẻ? Không thể hoàn tác.
            </>
          }
        />
      </section>
    </div>
  );
}
