import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { ROUTES } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/server/supabase";

export type AdminUser = {
  id: string;
  email: string;
};

// cache() để layout, page và action trong cùng một request chỉ kiểm tra quyền một lần.
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return null;

  return { id: claims.sub, email: claims.email ?? "" };
});

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect(ROUTES.login);
  return admin;
}
