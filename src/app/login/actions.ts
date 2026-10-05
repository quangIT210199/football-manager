"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ROUTES } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/server/supabase";

export type LoginState = {
  error: string | null;
  email: string;
};

const loginSchema = z.object({
  email: z.email("Email không hợp lệ."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
  next: z.string().optional(),
});

// Chỉ cho quay lại trong khu admin, tránh bị lợi dụng để chuyển hướng sang trang lạ.
function toSafeAdminPath(next: string | undefined): string {
  return next?.startsWith(ROUTES.admin) ? next : ROUTES.admin;
}

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Thông tin đăng nhập không hợp lệ.", email };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { error: "Email hoặc mật khẩu không đúng.", email };
  }

  redirect(toSafeAdminPath(parsed.data.next));
}
