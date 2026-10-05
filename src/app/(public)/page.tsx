import { LatestLineup } from "@/app/(public)/_components/LatestLineup";
import { SquadList } from "@/app/(public)/_components/SquadList";
import { TeamHeader } from "@/app/(public)/_components/TeamHeader";
import { TeamLeaders } from "@/app/(public)/_components/TeamLeaders";
import { getLatestMatchLineup } from "@/lib/server/lineups";
import { getTeamTotals, listActivePlayersWithStats } from "@/lib/server/teamOverview";
import { getTeamLeaders } from "@/lib/utils/playerStats";
import { sortPlayersByPosition } from "@/lib/utils/position";

// Admin sửa dữ liệu sẽ làm mới trang ngay (revalidatePath); mốc 1 giờ chỉ là lưới an toàn.
export const revalidate = 3600;

export default async function TeamOverviewPage() {
  const [players, totals, lineup] = await Promise.all([
    listActivePlayersWithStats(),
    getTeamTotals(),
    getLatestMatchLineup(),
  ]);

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-8">
      <TeamHeader totals={totals} playerCount={players.length} />
      <TeamLeaders leaders={getTeamLeaders(players)} />
      <LatestLineup lineup={lineup} />
      <SquadList players={sortPlayersByPosition(players)} />
    </main>
  );
}
