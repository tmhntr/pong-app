export type ActionType = 0 | 1 | 2;
export type CoordinateData = { x: number; y: number };
export type GameObjectState = {
  position: CoordinateData;
  velocity: CoordinateData;
};
export type Action = {
  payload: {
    velocity: CoordinateData;
  };
  timestamp: number;
};
export type Side = "left" | "right";
export type GameState = {
  score: { left: number; right: number };
  status: "playing" | "paused";
  timestamp: number;
  left: GameObjectState;
  right: GameObjectState;
  ball: GameObjectState;
};

export type GameObject = {
  HEIGHT: number;
  WIDTH: number;
  state: GameObjectState;
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};
