import type { FormState } from "@/types/form";

export const TEAM_NAME = "Ngọa Long";

export const ROUTES = {
  home: "/",
  login: "/login",
  admin: "/admin",
  adminPlayers: "/admin/players",
  adminNewPlayer: "/admin/players/new",
  adminMatches: "/admin/matches",
  adminNewMatch: "/admin/matches/new",
} as const;

export function getAdminPlayerPath(playerId: string): string {
  return `${ROUTES.adminPlayers}/${playerId}`;
}

export function getAdminMatchPath(matchId: string): string {
  return `${ROUTES.adminMatches}/${matchId}`;
}

export const PLAYER_PHOTO_BUCKET = "player-photos";

export const MAX_STARTERS_PER_SIDE = 7;

export const INITIAL_FORM_STATE: FormState = { error: null };
