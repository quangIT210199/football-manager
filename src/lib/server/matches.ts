import "server-only";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/server/supabase";
import type { LineupEntry, Match, MatchGoal, MatchSideCode } from "@/types/match";

export type AdminMatchDetail = {
  match: Match;
  lineup: LineupEntry[];
  goals: MatchGoal[];
};

function isSideCode(value: string): value is MatchSideCode {
  return value === "A" || value === "B";
}

export async function listMatches(): Promise<Match[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("matches").select("*").order("played_at", { ascending: false });
  if (error) throw new Error("Không đọc được danh sách trận đấu.");
  return data;
}

export async function getMatchForAdmin(matchId: string): Promise<AdminMatchDetail | null> {
  if (!z.uuid().safeParse(matchId).success) return null;

  const supabase = await createSupabaseServerClient();
  const [matchResult, lineupResult, goalsResult] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).maybeSingle(),
    supabase.from("match_lineups").select("player_id, side, is_starter").eq("match_id", matchId),
    supabase.from("match_goals").select("*").eq("match_id", matchId).order("minute", { ascending: true, nullsFirst: false }),
  ]);
  if (matchResult.error || lineupResult.error || goalsResult.error) throw new Error("Không đọc được thông tin trận đấu.");
  if (!matchResult.data) return null;

  const lineup = lineupResult.data.flatMap((row) =>
    isSideCode(row.side) ? [{ player_id: row.player_id, side: row.side, is_starter: row.is_starter }] : [],
  );
  return { match: matchResult.data, lineup, goals: goalsResult.data };
}

/** Bên (A/B) của từng cầu thủ trong đội hình một trận. */
export async function getLineupSides(matchId: string): Promise<Map<string, MatchSideCode>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("match_lineups").select("player_id, side").eq("match_id", matchId);
  if (error) throw new Error("Không đọc được đội hình trận đấu.");
  return new Map(data.flatMap((row) => (isSideCode(row.side) ? [[row.player_id, row.side] as const] : [])));
}
