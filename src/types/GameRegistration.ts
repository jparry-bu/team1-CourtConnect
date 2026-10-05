export const playerPositions = ["PG", "SG", "SF", "PF", "C"] as const;
export type PlayerPosition = (typeof playerPositions)[number];
export type GameRegistrations = Record<string, PlayerPosition>;
