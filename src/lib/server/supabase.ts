import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/server/supabaseEnv";
import type { Database } from "@/types/database";

export type ServerSupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component không được ghi cookie; proxy.ts đã làm mới session nên bỏ qua là an toàn.
        }
      },
    },
  });
}
