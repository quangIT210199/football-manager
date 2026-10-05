import "server-only";

import { createSupabasePublicClient } from "@/lib/server/supabasePublic";
import type { Database } from "@/types/database";
import type { TeamTotals } from "@/types/match";
import type { PlayerStats, PlayerWithStats } from "@/types/player";

type PlayerStatsRow = Database["public"]["Views"]["player_stats"]["Row"];

function toPlayerStats(row: PlayerStatsRow | undefined): PlayerStats {
  return {
    appearances: row?.appearances ?? 0,
    starts: row?.starts ?? 0,
    wins: row?.wins ?? 0,
    draws: row?.draws ?? 0,
    losses: row?.losses ?? 0,
    goals: row?.goals ?? 0,
    assists: row?.assists ?? 0,
    ownGoals: row?.own_goals ?? 0,
  };
}

export async function listActivePlayersWithStats(): Promise<PlayerWithStats[]> {
  const supabase = createSupabasePublicClient();
  const [playersResult, statsResult] = await Promise.all([
    supabase.from("players").select("*").eq("is_active", true),
    supabase.from("player_stats").select("*"),
  ]);
  if (playersResult.error || statsResult.error) throw new Error("Không đọc được danh sách cầu thủ.");

  const statsByPlayerId = new Map(statsResult.data.map((row) => [row.player_id, row]));
  return playersResult.data.map((player) => ({ ...player, stats: toPlayerStats(statsByPlayerId.get(player.id)) }));
}

export async function getTeamTotals(): Promise<TeamTotals> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from("matches").select("score_a, score_b").eq("status", "finished");
  if (error) throw new Error("Không đọc được số liệu trận đấu.");

  return {
    sessions: data.length,
    goals: data.reduce((sum, match) => sum + (match.score_a ?? 0) + (match.score_b ?? 0), 0),
  };
}
