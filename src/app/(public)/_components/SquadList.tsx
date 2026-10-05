import { PlayerCard } from "@/components/players/PlayerCard";
import { getAge } from "@/lib/utils/date";
import { getPlayerPhotoUrl } from "@/lib/utils/playerDisplay";
import { getWinRate } from "@/lib/utils/playerStats";
import { getPositionLabel, PLAYER_POSITIONS } from "@/lib/utils/position";
import type { PlayerWithStats } from "@/types/player";

type SquadListProps = {
  players: PlayerWithStats[];
};

type PlayerRowProps = {
  player: PlayerWithStats;
};

function getPlayerMeta(player: PlayerWithStats): string {
  const winRate = getWinRate(player);
  const parts = [
    player.date_of_birth ? `${getAge(player.date_of_birth)} tuổi` : null,
    player.stats.appearances > 0 ? `${player.stats.appearances} trận` : "Chưa ra sân",
    winRate === null ? null : `thắng ${winRate}%`,
  ];
  return parts.filter(Boolean).join(" · ");
}

function PlayerRow({ player }: PlayerRowProps) {
  const { goals, assists, ownGoals } = player.stats;
  return (
    <li className="flex items-center gap-4 border-l-[3px] border-gold bg-black/30 px-3 py-2.5">
      <PlayerCard
        fullName={player.full_name}
        shirtNumber={player.shirt_number}
        positionShort={getPositionLabel(player.position, "short")}
        photoUrl={getPlayerPhotoUrl(player.photo_path)}
        className="w-16"
      />
      <div className="grid min-w-0 gap-0.5">
        <p className="truncate text-lg leading-tight font-semibold">{player.full_name}</p>
        <p className="font-condensed text-sm tracking-wide text-chalk-dim tabular-nums">{getPlayerMeta(player)}</p>
        <p className="flex gap-3 font-condensed text-base font-bold tabular-nums">
          <span>
            {goals} <span className="font-medium text-chalk-dim">bàn</span>
          </span>
          <span>
            {assists} <span className="font-medium text-chalk-dim">KT</span>
          </span>
          {ownGoals > 0 && (
            <span>
              {ownGoals} <span className="font-medium text-chalk-dim">PL</span>
            </span>
          )}
        </p>
      </div>
    </li>
  );
}

/** Toàn bộ thành viên, chia nhóm theo vị trí (danh sách đầu vào đã được sắp xếp). */
export function SquadList({ players }: SquadListProps) {
  const groups = PLAYER_POSITIONS.map((position) => ({
    position,
    players: players.filter((player) => player.position === position),
  })).filter((group) => group.players.length > 0);

  if (groups.length === 0) {
    return <p className="text-chalk-dim">Danh sách cầu thủ đang được cập nhật.</p>;
  }

  return (
    <section aria-label="Thành viên đội" className="grid gap-8">
      {groups.map((group) => (
        <div key={group.position} className="grid gap-3">
          <h2 className="flex items-center gap-3 font-condensed text-base font-bold tracking-[0.2em] uppercase after:h-px after:flex-1 after:bg-chalk/40">
            {getPositionLabel(group.position)} · {group.players.length}
          </h2>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {group.players.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
