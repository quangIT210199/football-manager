export const TEAM_NAME = "Ngọa Long";

export const ROUTES = {
  home: "/",
  login: "/login",
  admin: "/admin",
  adminPlayers: "/admin/players",
  adminNewPlayer: "/admin/players/new",
} as const;

export function getAdminPlayerPath(playerId: string): string {
  return `${ROUTES.adminPlayers}/${playerId}`;
}

export const PLAYER_PHOTO_BUCKET = "player-photos";
