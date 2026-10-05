"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { removePlayerPhoto, uploadPlayerPhoto, validatePlayerPhoto } from "@/lib/server/playerPhotos";
import { createSupabaseServerClient } from "@/lib/server/supabase";
import { PLAYER_POSITIONS } from "@/lib/utils/position";

export type PlayerFormState = {
  error: string | null;
};

const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const SHIRT_NUMBER_RANGE_MESSAGE = "Số áo phải từ 0 đến 99.";
const checkbox = z.string().optional().transform((value) => value === "on");

const playerSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên.").max(80, "Họ tên tối đa 80 ký tự."),
  shirtNumber: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .pipe(
      z
        .number({ error: SHIRT_NUMBER_RANGE_MESSAGE })
        .int(SHIRT_NUMBER_RANGE_MESSAGE)
        .min(0, SHIRT_NUMBER_RANGE_MESSAGE)
        .max(99, SHIRT_NUMBER_RANGE_MESSAGE)
        .nullable(),
    ),
  position: z.enum(PLAYER_POSITIONS, { error: "Vị trí không hợp lệ." }),
  dateOfBirth: z
    .string()
    .transform((value) => value || null)
    .pipe(z.iso.date({ error: "Ngày sinh không hợp lệ." }).nullable()),
  isActive: checkbox,
  removePhoto: checkbox,
});

type PlayerInput = z.infer<typeof playerSchema>;

type ParsedPlayerForm = { ok: true; input: PlayerInput; photo: File | null } | { ok: false; error: string };

function parsePlayerForm(formData: FormData): ParsedPlayerForm {
  const parsed = playerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Thông tin cầu thủ không hợp lệ." };
  }

  const photoEntry = formData.get("photo");
  const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  const photoError = photo ? validatePlayerPhoto(photo) : null;
  if (photoError) return { ok: false, error: photoError };

  return { ok: true, input: parsed.data, photo };
}

function toPlayerRow(input: PlayerInput) {
  return {
    full_name: input.fullName,
    shirt_number: input.shirtNumber,
    position: input.position,
    date_of_birth: input.dateOfBirth,
    is_active: input.isActive,
  };
}

function toFriendlyDbError(code: string | undefined): string {
  if (code === UNIQUE_VIOLATION) return "Số áo này đã có cầu thủ khác dùng.";
  if (code === FOREIGN_KEY_VIOLATION) {
    return 'Cầu thủ đã có trong dữ liệu trận đấu nên không xoá được. Hãy bỏ tick "Đang tham gia" để ẩn cầu thủ.';
  }
  return "Không lưu được dữ liệu. Vui lòng thử lại.";
}

function finishPlayerChange(): never {
  // Thông tin cầu thủ hiện ở nhiều trang (danh sách, thống kê, đội hình) nên làm mới toàn bộ.
  revalidatePath("/", "layout");
  redirect(ROUTES.adminPlayers);
}

export async function createPlayer(_prevState: PlayerFormState, formData: FormData): Promise<PlayerFormState> {
  await requireAdmin();
  const form = parsePlayerForm(formData);
  if (!form.ok) return { error: form.error };

  const supabase = await createSupabaseServerClient();
  const playerId = randomUUID();
  const upload = await uploadPlayerPhoto(supabase, playerId, form.photo);
  if ("error" in upload) return { error: upload.error };

  const { error } = await supabase
    .from("players")
    .insert({ id: playerId, ...toPlayerRow(form.input), photo_path: upload.path });
  if (error) {
    await removePlayerPhoto(supabase, upload.path);
    return { error: toFriendlyDbError(error.code) };
  }

  finishPlayerChange();
}

export async function updatePlayer(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  await requireAdmin();
  const form = parsePlayerForm(formData);
  if (!form.ok) return { error: form.error };

  const supabase = await createSupabaseServerClient();
  const { data: current } = await supabase.from("players").select("photo_path").eq("id", playerId).maybeSingle();
  if (!current) return { error: "Không tìm thấy cầu thủ này." };

  const upload = await uploadPlayerPhoto(supabase, playerId, form.photo);
  if ("error" in upload) return { error: upload.error };

  const nextPhotoPath = upload.path ?? (form.input.removePhoto ? null : current.photo_path);
  const { error } = await supabase
    .from("players")
    .update({ ...toPlayerRow(form.input), photo_path: nextPhotoPath })
    .eq("id", playerId);
  if (error) {
    await removePlayerPhoto(supabase, upload.path);
    return { error: toFriendlyDbError(error.code) };
  }

  if (current.photo_path !== nextPhotoPath) await removePlayerPhoto(supabase, current.photo_path);
  finishPlayerChange();
}

export async function deletePlayer(playerId: string): Promise<PlayerFormState> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from("players")
    .delete()
    .eq("id", playerId)
    .select("photo_path")
    .maybeSingle();
  if (error) return { error: toFriendlyDbError(error.code) };
  if (!deleted) return { error: "Không tìm thấy cầu thủ này." };

  await removePlayerPhoto(supabase, deleted.photo_path);
  finishPlayerChange();
}
