import type { Metadata } from "next";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { createMatch } from "@/app/admin/matches/actions";
import { MatchInfoForm } from "@/app/admin/matches/_components/MatchInfoForm";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Tạo buổi đá",
};

export default async function NewMatchPage() {
  await requireAdmin();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Tạo buổi đá"
        description="Tạo xong sẽ chuyển sang bước chia đội và nhập tỉ số."
        back={{ href: ROUTES.adminMatches, label: "Danh sách trận đấu" }}
      />
      <MatchInfoForm action={createMatch} submitLabel="Tạo buổi đá" />
    </div>
  );
}
