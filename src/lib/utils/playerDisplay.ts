import { PLAYER_PHOTO_BUCKET } from "@/lib/constants";

/** Tên hiển thị trên thẻ: tên gọi (từ cuối), ví dụ "Hoàng Anh Tú" → "Tú". */
export function getShortName(fullName: string): string {
  return fullName.trim().split(/\s+/).at(-1) ?? "";
}

export function getPlayerPhotoUrl(photoPath: string | null): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!photoPath || !supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/${PLAYER_PHOTO_BUCKET}/${photoPath}`;
}
