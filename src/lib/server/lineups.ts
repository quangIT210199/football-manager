import "server-only";

import { createSupabasePublicClient } from "@/lib/server/supabasePublic";
import { sortPlayersByPosition } from "@/lib/utils/position";
import type { LineupSide, MatchLineup } from "@/types/match";
import type { LineupPlayer } from "@/types/player";

type LineupRow = {
  side: string;
  is_starter: boolean;
  players: LineupPlayer;
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
  if (!data) return null;

  const rows: LineupRow[] = data.match_lineups;
  return {
    matchId: data.id,
    playedAt: data.played_at,
    venue: data.venue,
    isFinished: data.status === "finished",
    sideA: toLineupSide(data.side_a_name, data.score_a, rows, "A"),
    sideB: toLineupSide(data.side_b_name, data.score_b, rows, "B"),
  };
}
