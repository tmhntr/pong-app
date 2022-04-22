export type Entities = {
  [index: string]: Position;
};

export type Position = { x: number; y: number };
export type GameState = {
  entities: { [index: string]: Position & { actionIndex: number } };
  score: { left: number; right: number };
  //   status: "playing" | "paused";
};

export type ServerUpdate = GameState & {
  timestamp: number;
  status: GameStatus;
};

export type GameStatus = "paused" | "playing";

export type Action = {
  entityId: string | number;
  inputSeqNumber: number;
  move: -1 | 0 | 1;
};
export type Score = { left: number; right: number };
