import type { LineupPlayer } from "@/types/player";

export type MatchSideKey = "a" | "b";

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
