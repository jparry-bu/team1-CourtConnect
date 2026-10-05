export interface GameMessage {
  id: string;
  gameId: number;
  body: string;
  createdAt: string;
}

export interface GameUpdate {
  id: string;
  gameId: number;
  kind: "cancelled" | "rescheduled";
  detail: string;
  createdAt: string;
}

export interface GameNotification {
  id: string;
  gameId: number;
  title: string;
  detail: string;
  createdAt: string;
  kind: "upcoming" | GameUpdate["kind"];
}
