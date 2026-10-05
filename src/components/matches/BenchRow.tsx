import { PlayerCard, type PlayerCardSide } from "@/components/players/PlayerCard";
import { getPlayerPhotoUrl } from "@/lib/utils/playerDisplay";
import { getPositionLabel } from "@/lib/utils/position";
import type { LineupSide } from "@/types/match";

type BenchRowProps = {
  side: LineupSide;
  cardSide: PlayerCardSide;
};

const LABEL_COLOR: Record<PlayerCardSide, string> = {
  a: "text-blau-light",
  b: "text-grana-light",
};

export function BenchRow({ side, cardSide }: BenchRowProps) {
  return (
    <div className="grid gap-2">
      <p className={`font-condensed text-sm font-bold tracking-[0.16em] uppercase ${LABEL_COLOR[cardSide]}`}>
        Dự bị {side.name}
      </p>
      {side.bench.length === 0 ? (
        <p className="text-sm text-chalk-dim">Không có dự bị.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {side.bench.map((player) => (
            <PlayerCard
              key={player.id}
              fullName={player.full_name}
              shirtNumber={player.shirt_number}
              positionShort={getPositionLabel(player.position, "short")}
              photoUrl={getPlayerPhotoUrl(player.photo_path)}
              side={cardSide}
              className="w-14"
            />
          ))}
        </div>
      )}
    </div>
  );
}
