import { getCreditedSide } from "@/lib/utils/goals";
import type { Match, MatchGoal, MatchSideCode } from "@/types/match";

type GoalTimelineProps = {
  match: Match;
  goals: MatchGoal[];
  sideByPlayerId: ReadonlyMap<string, MatchSideCode>;
  nameByPlayerId: ReadonlyMap<string, string>;
};

const SIDE_TAG_CLASS: Record<MatchSideCode, string> = {
  A: "text-blau-light",
  B: "text-grana-light",
};

const TAG_CLASS = "ml-2 border border-current px-1.5 font-condensed text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase";

export function GoalTimeline({ match, goals, sideByPlayerId, nameByPlayerId }: GoalTimelineProps) {
  if (goals.length === 0) {
    return <p className="text-chalk-dim">Chưa có chi tiết bàn thắng.</p>;
  }

  return (
    <ol className="grid">
      {goals.map((goal) => {
        const side = getCreditedSide(goal, sideByPlayerId);
        return (
          <li key={goal.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 border-b border-chalk/20 py-2.5">
            <span className="font-condensed text-xl font-bold text-gold tabular-nums">{goal.minute === null ? "–" : `${goal.minute}'`}</span>
            <div>
              <p className="font-semibold">
                {nameByPlayerId.get(goal.scorer_id) ?? "Không rõ"}
                {side && <span className={`${TAG_CLASS} ${SIDE_TAG_CLASS[side]}`}>+1 {side === "A" ? match.side_a_name : match.side_b_name}</span>}
                {goal.is_own_goal && <span className={`${TAG_CLASS} text-[#ff9a8a]`}>Phản lưới</span>}
              </p>
              {goal.assist_id && <p className="text-sm text-chalk-dim">Kiến tạo: {nameByPlayerId.get(goal.assist_id) ?? "Không rõ"}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
