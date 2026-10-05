import type { Metadata } from "next";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { createPlayer } from "@/app/admin/players/actions";
import { PlayerForm } from "@/app/admin/players/_components/PlayerForm";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Thêm cầu thủ",
};

export default async function NewPlayerPage() {
  await requireAdmin();

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Thêm cầu thủ" back={{ href: ROUTES.adminPlayers, label: "Danh sách cầu thủ" }} />
      <PlayerForm action={createPlayer} initialPhotoUrl={null} submitLabel="Thêm cầu thủ" />
    </div>
  );
}
