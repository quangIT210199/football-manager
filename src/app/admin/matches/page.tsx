import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import { MatchesTable } from "@/app/admin/matches/_components/MatchesTable";
import { getButtonClassName } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/auth";
import { listMatches } from "@/lib/server/matches";

export const metadata: Metadata = {
  title: "Trận đấu",
};

export default async function AdminMatchesPage() {
  await requireAdmin();
  const matches = await listMatches();
  const finishedCount = matches.filter((match) => match.status === "finished").length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Trận đấu"
        description={`${finishedCount} buổi đã đá · ${matches.length - finishedCount} sắp diễn ra`}
        actions={
          <Link href={ROUTES.adminNewMatch} className={getButtonClassName("primary")}>
            Tạo buổi đá
          </Link>
        }
      />
      {matches.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white p-6 text-sm text-muted">
          Chưa có buổi đá nào. Bấm <strong>Tạo buổi đá</strong>, sau đó chia đội và nhập tỉ số.
        </p>
      ) : (
        <MatchesTable matches={matches} />
      )}
    </div>
  );
}
