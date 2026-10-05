import type { PlayerPosition } from "./GameRegistration"
import type { PlayerDivision } from "./HostedGame"

export interface UserProfile {
  name: string
  email: string
  handle: string
  city: string
  position: PlayerPosition
  playerDivision: PlayerDivision
  heightInches?: number
  skill: "Beginner" | "Recreational" | "Intermediate" | "Competitive" | "Pro"
}

export interface StoredAccount extends UserProfile {
  passwordHash: string
}
