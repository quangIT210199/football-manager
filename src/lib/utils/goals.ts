import type { MatchSideCode } from "@/types/match";

type GoalLike = {
  scorer_id: string;
  is_own_goal: boolean;
};

/** Bàn thường tính cho bên của người ghi; phản lưới tính cho bên còn lại. */
export function getCreditedSide(goal: GoalLike, sideByPlayerId: ReadonlyMap<string, MatchSideCode>): MatchSideCode | null {
  const scorerSide = sideByPlayerId.get(goal.scorer_id);
  if (!scorerSide) return null;
  if (!goal.is_own_goal) return scorerSide;
  return scorerSide === "A" ? "B" : "A";
}

export function countGoalsBySide(
  goals: readonly GoalLike[],
  sideByPlayerId: ReadonlyMap<string, MatchSideCode>,
): Record<MatchSideCode, number> {
  const counts: Record<MatchSideCode, number> = { A: 0, B: 0 };
  for (const goal of goals) {
    const side = getCreditedSide(goal, sideByPlayerId);
    if (side) counts[side] += 1;
  }
  return counts;
}
