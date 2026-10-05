import "server-only";

import { PLAYER_PHOTO_BUCKET } from "@/lib/constants";
import type { ServerSupabaseClient } from "@/lib/server/supabase";

const MAX_PHOTO_BYTES = 1_000_000;
const ONE_YEAR_SECONDS = "31536000";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

type UploadResult = { path: string | null } | { error: string };

export function validatePlayerPhoto(file: File): string | null {
  if (!(file.type in EXTENSION_BY_TYPE)) return "Ảnh phải là WebP, JPG hoặc PNG.";
  if (file.size > MAX_PHOTO_BYTES) return "Ảnh quá lớn (tối đa 1 MB).";
  return null;
}

/** Tải ảnh lên (nếu có). Mỗi lần dùng tên file mới nên không bị cache ảnh cũ. */
export async function uploadPlayerPhoto(
  supabase: ServerSupabaseClient,
  playerId: string,
  file: File | null,
): Promise<UploadResult> {
  if (!file) return { path: null };

  const extension = EXTENSION_BY_TYPE[file.type] ?? "webp";
  const path = `${playerId}/${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from(PLAYER_PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: ONE_YEAR_SECONDS, upsert: false });

  return error ? { error: "Không tải được ảnh lên. Vui lòng thử lại." } : { path };
}

export async function removePlayerPhoto(supabase: ServerSupabaseClient, path: string | null): Promise<void> {
  if (!path) return;
  // Xoá thất bại chỉ để lại một file thừa trong kho ảnh, không ảnh hưởng dữ liệu nên không chặn thao tác chính.
  await supabase.storage.from(PLAYER_PHOTO_BUCKET).remove([path]);
}
