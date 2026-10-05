"use server";

import { z } from "zod";

import { MAX_STARTERS_PER_SIDE } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { revalidateTeamPages } from "@/lib/server/revalidate";
import { getLineupSides } from "@/lib/server/matches";
import { createSupabaseServerClient } from "@/lib/server/supabase";
import type { FormState } from "@/types/form";
import type { LineupEntry } from "@/types/match";

const lineupSchema = z
  .array(z.object({ player_id: z.uuid(), side: z.enum(["A", "B"]), is_starter: z.boolean() }))
  .refine((entries) => new Set(entries.map((entry) => entry.player_id)).size === entries.length, {
    error: "Mỗi cầu thủ chỉ được ở một bên.",
  })
  .refine(
    (entries) =>
      (["A", "B"] as const).every(
        (side) => entries.filter((entry) => entry.side === side && entry.is_starter).length <= MAX_STARTERS_PER_SIDE,
      ),
    { error: `Mỗi bên tối đa ${MAX_STARTERS_PER_SIDE} cầu thủ đá chính.` },
  );

const optionalPlayerId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid().nullable());

const goalSchema = z
  .object({
    minute: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : Number(value)))
      .pipe(z.number({ error: "Phút phải là số." }).int().min(0, "Phút từ 0 đến 200.").max(200, "Phút từ 0 đến 200.").nullable()),
    scorerId: z.uuid({ error: "Vui lòng chọn cầu thủ." }),
    kind: z.enum(["goal", "own_goal"]),
    assistId: optionalPlayerId,
  })
  .refine((goal) => goal.assistId !== goal.scorerId, { error: "Người kiến tạo phải khác người ghi bàn." });


export async function saveLineup(matchId: string, entries: LineupEntry[]): Promise<FormState> {
  await requireAdmin();
  const parsed = lineupSchema.safeParse(entries);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Đội hình không hợp lệ." };

  const supabase = await createSupabaseServerClient();
  // Không cho bỏ khỏi đội hình người đã có bàn thắng / kiến tạo, nếu không sẽ không biết bàn đó tính cho bên nào.
  const { data: goals, error: goalsError } = await supabase
    .from("match_goals")
    .select("scorer_id, assist_id")
    .eq("match_id", matchId);
  if (goalsError) return { error: "Không đọc được bàn thắng của trận." };

  const selectedIds = new Set(parsed.data.map((entry) => entry.player_id));
  const hasOrphanGoal = goals.some(
    (goal) => !selectedIds.has(goal.scorer_id) || (goal.assist_id !== null && !selectedIds.has(goal.assist_id)),
  );
  if (hasOrphanGoal) {
    return { error: "Có cầu thủ đã ghi bàn / kiến tạo trong trận bị bỏ khỏi đội hình. Hãy xoá bàn thắng đó trước." };
  }

  const { error } = await supabase.rpc("save_match_lineup", { p_match_id: matchId, p_entries: parsed.data });
  if (error) return { error: "Không lưu được đội hình. Vui lòng thử lại." };

  revalidateTeamPages();
  return { error: null, success: "Đã lưu đội hình." };
}

export async function addGoal(matchId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = goalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Thông tin bàn thắng không hợp lệ." };

  const { minute, scorerId, kind, assistId } = parsed.data;
  const isOwnGoal = kind === "own_goal";
  const sides = await getLineupSides(matchId);
  if (!sides.has(scorerId) || (assistId && !sides.has(assistId))) {
    return { error: "Người ghi bàn và người kiến tạo phải có trong đội hình trận này." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("match_goals").insert({
    match_id: matchId,
    scorer_id: scorerId,
    assist_id: isOwnGoal ? null : assistId,
    is_own_goal: isOwnGoal,
    minute,
  });
  if (error) return { error: "Không lưu được bàn thắng. Vui lòng thử lại." };

  revalidateTeamPages();
  return { error: null, success: "Đã thêm bàn thắng." };
}

export async function deleteGoal(goalId: string): Promise<FormState> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("match_goals").delete().eq("id", goalId);
  if (error) return { error: "Không xoá được bàn thắng." };

  revalidateTeamPages();
  return { error: null };
}
