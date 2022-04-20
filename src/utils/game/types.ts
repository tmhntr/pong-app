export type ActionType = 0 | 1 | 2;
export type CoordinateData = { x: number; y: number };
export type GameObjectState = {
  position: CoordinateData;
  velocity?: CoordinateData;
};
export type GameStatus = "paused" | "playing";

export type Action = {
  entityId: string;
  inputSeqNumber: number;
  moveTime: number;
};
export type Score = { left: number; right: number };
export type Side = "left" | "right";
export type GameState = {
  score: Score;
  status: GameStatus;
  timestamp: number;
  entities: {
    left: GameObjectState;
    right: GameObjectState;
    ball: GameObjectState;
  };
  index: number;
  nextBounce?: number;
};

export type GameObject = {
  HEIGHT: number;
  WIDTH: number;
  state: GameObjectState;
  positionBuffer: { position: CoordinateData; timestamp: number }[];
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export type Game = {
  entities: {
    left: GameObject;
    right: GameObject;
    ball: GameObject;
  };
};
