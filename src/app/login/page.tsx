import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/login/_components/LoginForm";
import { ROUTES, TEAM_NAME } from "@/lib/constants";
import { getAdminUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getAdminUser()) redirect(ROUTES.admin);

  const { next } = await searchParams;

  return (
    <main className="bg-blaugrana grid min-h-dvh place-items-center px-4 py-10">
      <div className="grid w-full max-w-sm gap-6">
        <header className="grid gap-1 text-center">
          <p className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-gold">Khu quản trị</p>
          <h1 className="font-display text-5xl uppercase">{TEAM_NAME}</h1>
        </header>
        <LoginForm next={typeof next === "string" ? next : ""} />
        <Link href={ROUTES.home} className="text-center text-sm text-chalk-dim hover:text-chalk">
          ← Về trang đội bóng
        </Link>
      </div>
    </main>
  );
}
