"use server";

import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/server/supabase";

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ROUTES.login);
}
