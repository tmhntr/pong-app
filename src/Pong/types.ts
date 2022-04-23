export type Entity = Position & {
  actionIndex: number;
  type: "paddle" | "ball";
};

export type Entities = {
  [index: string]: Entity;
};
export type EntitySpec = {
  height: number;
  width: number;
  vx?: number;
  vy: number;
};
export type BallSpec = EntitySpec & {
  vx: number;
};
export type Position = { x: number; y: number };
export type GameState = {
  entities: Entities;
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
  move: number;
};
export type Score = { left: number; right: number };
