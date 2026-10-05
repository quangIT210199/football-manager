import "server-only";

import { createSupabaseServerClient } from "@/lib/server/supabase";

export type TeamCounts = {
  players: number;
  finishedMatches: number;
};

export async function getTeamCounts(): Promise<TeamCounts> {
  const supabase = await createSupabaseServerClient();
  const [playersResult, matchesResult] = await Promise.all([
    supabase.from("players").select("*", { count: "exact", head: true }),
    supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "finished"),
  ]);

  if (playersResult.error || matchesResult.error) {
    throw new Error("Không đọc được số liệu đội bóng từ database.");
  }

  return {
    players: playersResult.count ?? 0,
    finishedMatches: matchesResult.count ?? 0,
  };
}
