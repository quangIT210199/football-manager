import "server-only";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/server/supabase";
import type { Player } from "@/types/player";

export async function listPlayers(): Promise<Player[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("players").select("*");
  if (error) throw new Error("Không đọc được danh sách cầu thủ.");
  return data;
}

export async function getPlayer(playerId: string): Promise<Player | null> {
  if (!z.uuid().safeParse(playerId).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("players").select("*").eq("id", playerId).maybeSingle();
  if (error) throw new Error("Không đọc được thông tin cầu thủ.");
  return data;
}
