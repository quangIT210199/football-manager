import { deleteGoal } from "@/app/admin/matches/[matchId]/actions";
import { AddGoalForm } from "@/app/admin/matches/[matchId]/_components/AddGoalForm";
import { GoalRow } from "@/app/admin/matches/[matchId]/_components/GoalRow";
import { countGoalsBySide, getCreditedSide } from "@/lib/utils/goals";
import type { FormState } from "@/types/form";
import type { Match, MatchGoal, MatchSideCode } from "@/types/match";
import type { Player } from "@/types/player";

type GoalsSectionProps = {
  match: Match;
  goals: MatchGoal[];
  sideByPlayerId: ReadonlyMap<string, MatchSideCode>;
  playerById: ReadonlyMap<string, Player>;
  addAction: (state: FormState, formData: FormData) => Promise<FormState>;
};

const SIDE_BADGE_CLASS: Record<MatchSideCode, string> = {
  A: "bg-blau/10 text-blau",
  B: "bg-grana/10 text-grana",
};

type GoalsSummaryProps = {
  match: Match;
  counted: Record<MatchSideCode, number>;
  goalCount: number;
};

function GoalsSummary({ match, counted, goalCount }: GoalsSummaryProps) {
  if (goalCount === 0) {
    return <p className="text-sm text-muted">Chưa nhập chi tiết bàn thắng (không bắt buộc).</p>;
  }
  const isFinished = match.status === "finished";
  const matchesScore = isFinished && counted.A === match.score_a && counted.B === match.score_b;
  const text = `Đã nhập chi tiết ${counted.A} – ${counted.B}${isFinished ? `, tỉ số ${match.score_a} – ${match.score_b}` : ""}.`;
  return (
    <p className={`justify-self-start rounded-md px-3 py-1.5 text-sm font-medium ${matchesScore ? "bg-green-50 text-green-800" : "bg-gold/20 text-ink"}`}>
      {text} {matchesScore ? "Khớp tỉ số." : "Chưa khớp tỉ số (chỉ là nhắc nhở)."}
    </p>
  );
}

export function GoalsSection({ match, goals, sideByPlayerId, playerById, addAction }: GoalsSectionProps) {
  const sideName = (side: MatchSideCode) => (side === "A" ? match.side_a_name : match.side_b_name);
  const nameOf = (playerId: string | null) => (playerId ? playerById.get(playerId)?.full_name ?? "Không rõ" : "");
  const playerOptions = [...sideByPlayerId.entries()].map(([playerId, side]) => ({
    value: playerId,
    label: `[${sideName(side)}] ${playerById.get(playerId)?.shirt_number ?? "–"} · ${nameOf(playerId)}`,
  }));

  if (playerOptions.length === 0) {
    return <p className="text-sm text-muted">Hãy lưu đội hình trước, sau đó mới nhập được người ghi bàn.</p>;
  }

  return (
    <div className="grid gap-4">
      <GoalsSummary match={match} counted={countGoalsBySide(goals, sideByPlayerId)} goalCount={goals.length} />
      {goals.length > 0 && (
        <ul className="max-w-2xl rounded-lg border border-line bg-white">
          {goals.map((goal) => {
            const credited = getCreditedSide(goal, sideByPlayerId);
            return (
              <GoalRow
                key={goal.id}
                minute={goal.minute}
                scorerName={nameOf(goal.scorer_id)}
                detail={goal.is_own_goal ? "phản lưới" : goal.assist_id ? `kiến tạo: ${nameOf(goal.assist_id)}` : ""}
                creditedSideName={credited ? sideName(credited) : "?"}
                creditedSideClass={credited ? SIDE_BADGE_CLASS[credited] : "bg-paper text-muted"}
                deleteAction={deleteGoal.bind(null, goal.id)}
              />
            );
          })}
        </ul>
      )}
      <AddGoalForm action={addAction} playerOptions={playerOptions} />
    </div>
  );
}
