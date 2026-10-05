export const gameDivisions = ["Men's", "Women's", "Co-ed"] as const;
export type GameDivision = (typeof gameDivisions)[number];
export type PlayerDivision = Exclude<GameDivision, "Co-ed">;

export interface HostedGame {
  id: number;
  court: string;
  date: string;
  time: string;
  format: string;
  skill: string;
  players: number;
  division: GameDivision;
  hostEmail?: string;
  cancelled?: boolean;
}
