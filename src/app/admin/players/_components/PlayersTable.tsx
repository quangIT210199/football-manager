import Image from "next/image";
import Link from "next/link";

import { PlayerSilhouette } from "@/components/players/PlayerSilhouette";
import { getAdminPlayerPath } from "@/lib/constants";
import { getPlayerPhotoUrl } from "@/lib/utils/playerDisplay";
import { getPositionLabel } from "@/lib/utils/position";
import type { Player } from "@/types/player";

type PlayersTableProps = {
  players: Player[];
};

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "–";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

type PhotoThumbProps = {
  player: Player;
};

function PhotoThumb({ player }: PhotoThumbProps) {
  const photoUrl = getPlayerPhotoUrl(player.photo_path);
  return (
    <span className="relative block aspect-[3/4] w-9 overflow-hidden rounded bg-linear-to-b from-[#2f7fd6] to-[#002a5c]">
      {photoUrl ? (
        <Image src={photoUrl} alt="" fill unoptimized sizes="36px" className="object-cover object-top" />
      ) : (
        <PlayerSilhouette />
      )}
    </span>
  );
}

export function PlayersTable({ players }: PlayersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs tracking-wider text-muted uppercase">
            <th className="px-3 py-2.5 font-semibold">Ảnh</th>
            <th className="px-3 py-2.5 font-semibold">Số</th>
            <th className="px-3 py-2.5 font-semibold">Họ tên</th>
            <th className="px-3 py-2.5 font-semibold">Vị trí</th>
            <th className="px-3 py-2.5 font-semibold">Ngày sinh</th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className={`border-b border-line last:border-b-0 ${player.is_active ? "" : "opacity-55"}`}>
              <td className="px-3 py-2">
                <PhotoThumb player={player} />
              </td>
              <td className="px-3 py-2 font-mono tabular-nums">{player.shirt_number ?? "–"}</td>
              <td className="px-3 py-2 font-medium">
                {player.full_name}
                {!player.is_active && <span className="ml-2 text-xs text-muted">(đã ẩn)</span>}
                {!player.photo_path && <span className="block text-xs text-muted">Chưa có ảnh</span>}
              </td>
              <td className="px-3 py-2">{getPositionLabel(player.position)}</td>
              <td className="px-3 py-2 tabular-nums">{formatDate(player.date_of_birth)}</td>
              <td className="px-3 py-2 text-right">
                <Link href={getAdminPlayerPath(player.id)} className="font-semibold text-blau hover:underline">
                  Sửa
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
