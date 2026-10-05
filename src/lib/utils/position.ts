export const PLAYER_POSITIONS = ["GK", "DF", "MF", "FW"] as const;

export type PlayerPosition = (typeof PLAYER_POSITIONS)[number];

const POSITION_LABELS: Record<PlayerPosition, { full: string; short: string }> = {
  GK: { full: "Thủ môn", short: "TM" },
  DF: { full: "Hậu vệ", short: "HV" },
  MF: { full: "Tiền vệ", short: "TV" },
  FW: { full: "Tiền đạo", short: "TĐ" },
};

export const POSITION_OPTIONS = PLAYER_POSITIONS.map((value) => ({ value, label: POSITION_LABELS[value].full }));

export function isPlayerPosition(value: string): value is PlayerPosition {
  return (PLAYER_POSITIONS as readonly string[]).includes(value);
}

export function getPositionLabel(position: string, variant: "full" | "short" = "full"): string {
  return isPlayerPosition(position) ? POSITION_LABELS[position][variant] : position;
}

type SortablePlayer = {
  position: string;
  shirt_number: number | null;
};

// Thủ môn → hậu vệ → tiền vệ → tiền đạo, trong cùng vị trí xếp theo số áo (chưa có số xuống cuối).
export function sortPlayersByPosition<T extends SortablePlayer>(players: readonly T[]): T[] {
  const rank = (position: string) => (isPlayerPosition(position) ? PLAYER_POSITIONS.indexOf(position) : PLAYER_POSITIONS.length);
  return [...players].sort(
    (a, b) => rank(a.position) - rank(b.position) || (a.shirt_number ?? 100) - (b.shirt_number ?? 100),
  );
}
