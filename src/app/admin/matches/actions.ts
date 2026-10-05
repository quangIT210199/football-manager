"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminMatchPath, ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { revalidateTeamPages } from "@/lib/server/revalidate";
import { createSupabaseServerClient } from "@/lib/server/supabase";
import { fromVietnamDateTimeInput } from "@/lib/utils/date";
import type { FormState } from "@/types/form";

const SAVE_FAILED_MESSAGE = "Không lưu được dữ liệu. Vui lòng thử lại.";
const SCORE_MESSAGE = "Tỉ số phải là số nguyên từ 0 đến 99.";

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((value) => value || null);

const matchInfoSchema = z.object({
  playedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Vui lòng chọn ngày giờ đá."),
  venue: optionalText(120, "Tên sân tối đa 120 ký tự."),
  sideAName: z.string().trim().min(1, "Vui lòng nhập tên bên A.").max(40, "Tên bên tối đa 40 ký tự."),
  sideBName: z.string().trim().min(1, "Vui lòng nhập tên bên B.").max(40, "Tên bên tối đa 40 ký tự."),
  notes: optionalText(1000, "Ghi chú tối đa 1000 ký tự."),
});

const scoreField = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number({ error: SCORE_MESSAGE }).int(SCORE_MESSAGE).min(0, SCORE_MESSAGE).max(99, SCORE_MESSAGE).nullable());

const matchResultSchema = z
  .object({
    status: z.enum(["scheduled", "finished"], { error: "Trạng thái không hợp lệ." }),
    scoreA: scoreField,
    scoreB: scoreField,
  })
  .refine((result) => result.status === "scheduled" || (result.scoreA !== null && result.scoreB !== null), {
    error: "Buổi đã đá cần nhập đủ tỉ số hai bên.",
  });

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
}

function parseMatchInfo(formData: FormData) {
  const parsed = matchInfoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false as const, error: firstIssue(parsed.error) };
  const { playedAt, venue, sideAName, sideBName, notes } = parsed.data;
  return {
    ok: true as const,
    row: { played_at: fromVietnamDateTimeInput(playedAt), venue, side_a_name: sideAName, side_b_name: sideBName, notes },
  };
}


export async function createMatch(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const info = parseMatchInfo(formData);
  if (!info.ok) return { error: info.error };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("matches").insert(info.row).select("id").single();
  if (error) return { error: SAVE_FAILED_MESSAGE };

  revalidateTeamPages();
  redirect(getAdminMatchPath(data.id));
}

export async function updateMatchInfo(matchId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const info = parseMatchInfo(formData);
  if (!info.ok) return { error: info.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("matches").update(info.row).eq("id", matchId);
  if (error) return { error: SAVE_FAILED_MESSAGE };

  revalidateTeamPages();
  return { error: null, success: "Đã lưu thông tin buổi đá." };
}

export async function updateMatchResult(matchId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = matchResultSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const { status, scoreA, scoreB } = parsed.data;
  const isFinished = status === "finished";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("matches")
    .update({ status, score_a: isFinished ? scoreA : null, score_b: isFinished ? scoreB : null })
    .eq("id", matchId);
  if (error) return { error: SAVE_FAILED_MESSAGE };

  revalidateTeamPages();
  return { error: null, success: isFinished ? "Đã lưu tỉ số." : "Đã chuyển về trạng thái sắp diễn ra." };
}

export async function deleteMatch(matchId: string): Promise<FormState> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("matches").delete().eq("id", matchId);
  if (error) return { error: "Không xoá được buổi đá. Vui lòng thử lại." };

  revalidateTeamPages();
  redirect(ROUTES.adminMatches);
}
