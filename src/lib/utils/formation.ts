import { isPlayerPosition, PLAYER_POSITIONS, type PlayerPosition } from "@/lib/utils/position";

export type PitchSpot = {
  /** % theo chiều dài sân, tính từ khung thành của bên A. */
  x: number;
  /** % theo chiều rộng sân. */
  y: number;
};

// Độ sâu của từng tuyến cho bên A (nửa sân bên trái); bên B lấy đối xứng qua giữa sân.
const LINE_DEPTH: Record<PlayerPosition, number> = { GK: 7, DF: 18, MF: 31, FW: 43 };

type Positioned = {
  position: string;
};

function toLinePosition(position: string): PlayerPosition {
  return isPlayerPosition(position) ? position : "MF";
}

/** Xếp cầu thủ đá chính thành các tuyến theo vị trí, dàn đều theo chiều rộng sân. */
export function getFormationSpots<T extends Positioned>(starters: readonly T[]): Array<{ player: T; spot: PitchSpot }> {
  return PLAYER_POSITIONS.flatMap((linePosition) => {
    const line = starters.filter((player) => toLinePosition(player.position) === linePosition);
    return line.map((player, index) => ({
      player,
      spot: { x: LINE_DEPTH[linePosition], y: ((index + 1) / (line.length + 1)) * 100 },
    }));
  });
}

/** Sơ đồ kiểu "2-3-1" (không tính thủ môn). */
export function getFormationLabel(starters: readonly Positioned[]): string {
  return PLAYER_POSITIONS.filter((position) => position !== "GK")
    .map((position) => starters.filter((player) => toLinePosition(player.position) === position).length)
    .filter((count) => count > 0)
    .join("-");
}

export function mirrorSpot(spot: PitchSpot): PitchSpot {
  return { x: 100 - spot.x, y: 100 - spot.y };
}
