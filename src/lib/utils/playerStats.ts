import type { PlayerWithStats } from "@/types/player";

// Tỉ lệ thắng chỉ có ý nghĩa khi đã đá đủ số buổi.
export const MIN_APPEARANCES_FOR_WIN_RATE = 3;

export function getWinRate(player: PlayerWithStats): number | null {
  const { wins, appearances } = player.stats;
  return appearances > 0 ? Math.round((wins / appearances) * 100) : null;
}

export type TeamLeaders = {
  topScorer: PlayerWithStats | null;
  topAssister: PlayerWithStats | null;
  bestWinRate: PlayerWithStats | null;
};

function pickTop(players: readonly PlayerWithStats[], score: (player: PlayerWithStats) => number): PlayerWithStats | null {
  const best = [...players].sort((a, b) => score(b) - score(a) || b.stats.appearances - a.stats.appearances)[0];
  return best && score(best) > 0 ? best : null;
}

export function getTeamLeaders(players: readonly PlayerWithStats[]): TeamLeaders {
  const eligibleForWinRate = players.filter((player) => player.stats.appearances >= MIN_APPEARANCES_FOR_WIN_RATE);
  return {
    topScorer: pickTop(players, (player) => player.stats.goals),
    topAssister: pickTop(players, (player) => player.stats.assists),
    bestWinRate: pickTop(eligibleForWinRate, (player) => getWinRate(player) ?? 0),
  };
}
