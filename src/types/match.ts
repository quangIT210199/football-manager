import type { Database } from "@/types/database";
import type { LineupPlayer } from "@/types/player";

type Tables = Database["public"]["Tables"];

export type Match = Tables["matches"]["Row"];
export type MatchGoal = Tables["match_goals"]["Row"];

export type MatchSideKey = "a" | "b";
/** Giá trị cột side trong DB. */
export type MatchSideCode = "A" | "B";

export type LineupEntry = {
  player_id: string;
  side: MatchSideCode;
  is_starter: boolean;
};

export type LineupSide = {
  name: string;
  score: number | null;
  starters: LineupPlayer[];
  bench: LineupPlayer[];
};

export type MatchLineup = {
  matchId: string;
  playedAt: string;
  venue: string | null;
  isFinished: boolean;
  sideA: LineupSide;
  sideB: LineupSide;
};

export type TeamTotals = {
  sessions: number;
  goals: number;
};
