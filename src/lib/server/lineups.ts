import "server-only";

import { z } from "zod";

import { createSupabasePublicClient } from "@/lib/server/supabasePublic";
import { sortPlayersByPosition } from "@/lib/utils/position";
import type { LineupSide, MatchLineup } from "@/types/match";
import type { LineupPlayer } from "@/types/player";

type LineupRow = {
  side: string;
  is_starter: boolean;
  players: LineupPlayer;
};

type MatchWithLineupRow = {
  id: string;
  played_at: string;
  venue: string | null;
  status: string;
  side_a_name: string;
  side_b_name: string;
  score_a: number | null;
  score_b: number | null;
  match_lineups: LineupRow[];
};

// Giữ là một chuỗi liền để supabase-js suy ra được kiểu dữ liệu trả về.
const LINEUP_SELECT =
  "id, played_at, venue, status, side_a_name, side_b_name, score_a, score_b, match_lineups!inner(side, is_starter, players(id, full_name, shirt_number, position, photo_path))";

function toLineupSide(name: string, score: number | null, rows: readonly LineupRow[], side: "A" | "B"): LineupSide {
  const sideRows = rows.filter((row) => row.side === side);
  const pick = (isStarter: boolean) =>
    sortPlayersByPosition(sideRows.filter((row) => row.is_starter === isStarter).map((row) => row.players));
  return { name, score, starters: pick(true), bench: pick(false) };
}

function toMatchLineup(row: MatchWithLineupRow): MatchLineup {
  return {
    matchId: row.id,
    playedAt: row.played_at,
    venue: row.venue,
    isFinished: row.status === "finished",
    sideA: toLineupSide(row.side_a_name, row.score_a, row.match_lineups, "A"),
    sideB: toLineupSide(row.side_b_name, row.score_b, row.match_lineups, "B"),
  };
}

/** Trận gần nhất (đã đá hoặc sắp đá) đã có đội hình. */
export async function getLatestMatchLineup(): Promise<MatchLineup | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("matches")
    .select(LINEUP_SELECT)
    .order("played_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Không đọc được đội hình trận gần nhất.");
  return data ? toMatchLineup(data) : null;
}

/** Đội hình của một trận; null nếu trận chưa có đội hình hoặc không tồn tại. */
export async function getMatchLineup(matchId: string): Promise<MatchLineup | null> {
  if (!z.uuid().safeParse(matchId).success) return null;

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from("matches").select(LINEUP_SELECT).eq("id", matchId).maybeSingle();
  if (error) throw new Error("Không đọc được đội hình trận đấu.");
  return data ? toMatchLineup(data) : null;
}
