import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/server/supabaseEnv";
import type { Database } from "@/types/database";

/**
 * Client chỉ đọc cho trang công khai: không đọc cookie nên trang được render tĩnh và
 * chỉ render lại khi admin thay đổi dữ liệu (revalidatePath).
 */
export function createSupabasePublicClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
