import Link from "next/link";

import { getAdminMatchPath } from "@/lib/constants";
import { formatMatchDateTime } from "@/lib/utils/date";
import type { Match } from "@/types/match";

type MatchesTableProps = {
  matches: Match[];
};

type StatusBadgeProps = {
  isFinished: boolean;
};

function StatusBadge({ isFinished }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isFinished ? "bg-green-50 text-green-800" : "bg-gold/20 text-ink"
      }`}
    >
      {isFinished ? "Đã đá" : "Sắp diễn ra"}
    </span>
  );
}

export function MatchesTable({ matches }: MatchesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs tracking-wider text-muted uppercase">
            <th className="px-3 py-2.5 font-semibold">Ngày giờ</th>
            <th className="px-3 py-2.5 font-semibold">Sân</th>
            <th className="px-3 py-2.5 font-semibold">Hai bên</th>
            <th className="px-3 py-2.5 font-semibold">Tỉ số</th>
            <th className="px-3 py-2.5 font-semibold">Trạng thái</th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const isFinished = match.status === "finished";
            return (
              <tr key={match.id} className="border-b border-line last:border-b-0">
                <td className="px-3 py-2.5 whitespace-nowrap">{formatMatchDateTime(match.played_at)}</td>
                <td className="px-3 py-2.5">{match.venue ?? "–"}</td>
                <td className="px-3 py-2.5">
                  <span className="text-blau">{match.side_a_name}</span> – <span className="text-grana">{match.side_b_name}</span>
                </td>
                <td className="px-3 py-2.5 font-mono tabular-nums">
                  {isFinished ? `${match.score_a} – ${match.score_b}` : "–"}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge isFinished={isFinished} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={getAdminMatchPath(match.id)} className="font-semibold text-blau hover:underline">
                    Mở
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
