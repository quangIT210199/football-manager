import { PlayerCard, type PlayerCardSide } from "@/components/players/PlayerCard";
import { getFormationSpots, mirrorSpot, type PitchSpot } from "@/lib/utils/formation";
import { getPlayerPhotoUrl } from "@/lib/utils/playerDisplay";
import { getPositionLabel } from "@/lib/utils/position";
import type { LineupSide } from "@/types/match";
import type { LineupPlayer } from "@/types/player";

type PitchProps = {
  sideA: LineupSide;
  sideB: LineupSide;
};

type PlacedPlayer = {
  player: LineupPlayer;
  spot: PitchSpot;
  side: PlayerCardSide;
};

const LINE_STYLE = { fill: "none", stroke: "#eef1f8", strokeOpacity: 0.5, strokeWidth: 0.5 } as const;

function PitchMarkings() {
  return (
    <>
      <svg viewBox="0 0 160 100" aria-hidden="true" className="absolute inset-0 size-full max-sm:hidden">
        <g {...LINE_STYLE}>
          <rect x="1" y="1" width="158" height="98" />
          <line x1="80" y1="1" x2="80" y2="99" />
          <circle cx="80" cy="50" r="12" />
          <rect x="1" y="28" width="20" height="44" />
          <rect x="139" y="28" width="20" height="44" />
        </g>
      </svg>
      <svg viewBox="0 0 100 178" aria-hidden="true" className="absolute inset-0 hidden size-full max-sm:block">
        <g {...LINE_STYLE}>
          <rect x="1" y="1" width="98" height="176" />
          <line x1="1" y1="89" x2="99" y2="89" />
          <circle cx="50" cy="89" r="12" />
          <rect x="28" y="1" width="44" height="20" />
          <rect x="28" y="157" width="44" height="20" />
        </g>
      </svg>
    </>
  );
}

function placeSide(side: LineupSide, cardSide: PlayerCardSide): PlacedPlayer[] {
  return getFormationSpots(side.starters).map(({ player, spot }) => ({
    player,
    spot: cardSide === "a" ? spot : mirrorSpot(spot),
    side: cardSide,
  }));
}

/** Sơ đồ ra sân: máy tính sân ngang (A trái, B phải), điện thoại sân dọc (A trên, B dưới). */
export function Pitch({ sideA, sideB }: PitchProps) {
  const placed = [...placeSide(sideA, "a"), ...placeSide(sideB, "b")];

  return (
    <div
      role="img"
      aria-label={`Sơ đồ ra sân: ${sideA.name} gặp ${sideB.name}`}
      className="@container relative aspect-[160/100] w-full rounded-md bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.06),rgb(0_0_0/0.35))] max-sm:aspect-[100/178]"
    >
      <PitchMarkings />
      <span className="absolute top-2 left-3 font-condensed text-sm font-bold tracking-[0.16em] text-blau-light uppercase">
        {sideA.name}
      </span>
      <span className="absolute top-2 right-3 font-condensed text-sm font-bold tracking-[0.16em] text-grana-light uppercase max-sm:top-auto max-sm:right-auto max-sm:bottom-2 max-sm:left-3">
        {sideB.name}
      </span>
      {placed.map(({ player, spot, side }) => (
        <div
          key={player.id}
          style={{ "--x": `${spot.x}%`, "--y": `${spot.y}%` }}
          className="absolute top-(--y) left-(--x) w-[8.6cqw] -translate-x-1/2 -translate-y-1/2 max-sm:top-(--x) max-sm:left-(--y) max-sm:w-[15cqw]"
        >
          <PlayerCard
            fullName={player.full_name}
            shirtNumber={player.shirt_number}
            positionShort={getPositionLabel(player.position, "short")}
            photoUrl={getPlayerPhotoUrl(player.photo_path)}
            side={side}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}
