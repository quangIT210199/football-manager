import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { AdminSection } from "@/app/admin/_components/AdminSection";
import { ConfirmDeleteButton } from "@/app/admin/_components/ConfirmDeleteButton";
import { addGoal, saveLineup } from "@/app/admin/matches/[matchId]/actions";
import { GoalsSection } from "@/app/admin/matches/[matchId]/_components/GoalsSection";
import { LineupEditor } from "@/app/admin/matches/[matchId]/_components/LineupEditor";
import { ResultForm } from "@/app/admin/matches/[matchId]/_components/ResultForm";
import { deleteMatch, updateMatchInfo, updateMatchResult } from "@/app/admin/matches/actions";
import { MatchInfoForm } from "@/app/admin/matches/_components/MatchInfoForm";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { getMatchForAdmin } from "@/lib/server/matches";
import { listPlayers } from "@/lib/server/players";
import { formatMatchDateTime } from "@/lib/utils/date";
import { sortPlayersByPosition } from "@/lib/utils/position";

export const metadata: Metadata = {
  title: "Buổi đá",
};

export default async function AdminMatchPage({ params }: PageProps<"/admin/matches/[matchId]">) {
  await requireAdmin();
  const { matchId } = await params;
  const [detail, allPlayers] = await Promise.all([getMatchForAdmin(matchId), listPlayers()]);
  if (!detail) notFound();

  const { match, lineup, goals } = detail;
  const sideByPlayerId = new Map(lineup.map((entry) => [entry.player_id, entry.side]));
  const playerById = new Map(allPlayers.map((player) => [player.id, player]));
  // Cầu thủ đã ẩn vẫn hiện nếu đang có trong đội hình trận này.
  const editorPlayers = sortPlayersByPosition(allPlayers.filter((player) => player.is_active || sideByPlayerId.has(player.id)));

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        title={formatMatchDateTime(match.played_at)}
        description={`${match.side_a_name} – ${match.side_b_name}${match.venue ? ` · ${match.venue}` : ""}`}
        back={{ href: ROUTES.adminMatches, label: "Danh sách trận đấu" }}
      />
      <AdminSection
        title="1. Chia đội"
        description="Chọn bên và vai trò cho từng cầu thủ (mỗi bên tối đa 7 người đá chính). Sơ đồ bên dưới cập nhật ngay; bấm Lưu đội hình để đưa lên trang công khai."
      >
        <LineupEditor
          action={saveLineup.bind(null, match.id)}
          players={editorPlayers}
          initialEntries={lineup}
          sideAName={match.side_a_name}
          sideBName={match.side_b_name}
        />
      </AdminSection>
      <AdminSection title="2. Kết quả" description="Chuyển sang Đã đá và nhập tỉ số khi buổi đá kết thúc.">
        <ResultForm key={`${match.status}-${match.score_a}-${match.score_b}`} action={updateMatchResult.bind(null, match.id)} match={match} />
      </AdminSection>
      <AdminSection title="3. Chi tiết bàn thắng" description="Không bắt buộc. Dùng để tính vua phá lưới, kiến tạo và phản lưới.">
        <GoalsSection
          match={match}
          goals={goals}
          sideByPlayerId={sideByPlayerId}
          playerById={playerById}
          addAction={addGoal.bind(null, match.id)}
        />
      </AdminSection>
      <AdminSection title="Thông tin buổi đá">
        <MatchInfoForm action={updateMatchInfo.bind(null, match.id)} match={match} submitLabel="Lưu thông tin" />
      </AdminSection>
      <AdminSection title="Xoá buổi đá" description="Xoá cả đội hình và bàn thắng của buổi này. Thống kê cầu thủ sẽ tính lại.">
        <ConfirmDeleteButton
          action={deleteMatch.bind(null, match.id)}
          triggerLabel="Xoá buổi đá"
          confirmMessage="Xoá hẳn buổi đá này? Không thể hoàn tác."
        />
      </AdminSection>
    </div>
  );
}
