import "server-only";

import { z } from "zod";

import { createSupabasePublicClient } from "@/lib/server/supabasePublic";
import type { Match, MatchGoal } from "@/types/match";

export async function listPublicMatches(): Promise<Match[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from("matches").select("*").order("played_at", { ascending: false });
  if (error) throw new Error("Không đọc được danh sách trận đấu.");
  return data;
}

export async function getPublicMatch(matchId: string): Promise<{ match: Match; goals: MatchGoal[] } | null> {
  if (!z.uuid().safeParse(matchId).success) return null;

  const supabase = createSupabasePublicClient();
  const [matchResult, goalsResult] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).maybeSingle(),
    supabase.from("match_goals").select("*").eq("match_id", matchId).order("minute", { ascending: true, nullsFirst: false }),
  ]);
  if (matchResult.error || goalsResult.error) throw new Error("Không đọc được thông tin trận đấu.");
  return matchResult.data ? { match: matchResult.data, goals: goalsResult.data } : null;
}
