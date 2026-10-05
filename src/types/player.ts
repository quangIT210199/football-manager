import type { Database } from "@/types/database";

export type Player = Database["public"]["Tables"]["players"]["Row"];

export type PlayerStats = {
  appearances: number;
  starts: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  assists: number;
  ownGoals: number;
};

export type PlayerWithStats = Player & {
  stats: PlayerStats;
};

/** Thông tin cầu thủ đủ để vẽ thẻ trên sân / hàng dự bị. */
export type LineupPlayer = Pick<Player, "id" | "full_name" | "shirt_number" | "position" | "photo_path">;
