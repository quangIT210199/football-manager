import type { MatchLineup, MatchSideCode } from "@/types/match";
import type { LineupPlayer } from "@/types/player";

function playersOf(side: MatchLineup["sideA"]): LineupPlayer[] {
  return [...side.starters, ...side.bench];
}

/** Bên (A/B) của từng cầu thủ có trong đội hình. */
export function getSideByPlayerId(lineup: MatchLineup | null): Map<string, MatchSideCode> {
  if (!lineup) return new Map();
  return new Map([
    ...playersOf(lineup.sideA).map((player) => [player.id, "A"] as const),
    ...playersOf(lineup.sideB).map((player) => [player.id, "B"] as const),
  ]);
}

export function getNameByPlayerId(lineup: MatchLineup | null): Map<string, string> {
  if (!lineup) return new Map();
  return new Map([...playersOf(lineup.sideA), ...playersOf(lineup.sideB)].map((player) => [player.id, player.full_name]));
}
