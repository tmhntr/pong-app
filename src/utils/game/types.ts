export type ActionType = 0 | 1 | 2;
export type CoordinateData = { x: number; y: number };
export type GameObjectState = {
  position: CoordinateData;
  velocity: CoordinateData;
};
export type Action = {
  target: "self" | "opponent" | "ball";
  payload: {
    velocity: CoordinateData;
  };
  timestamp: number;
};
export type GameState = {
  timestamp: number;
  index: number;
  self: GameObjectState;
  opponent: GameObjectState;
  ball: GameObjectState;
};

export type GameObject = {
  HEIGHT: number;
  WIDTH: number;
  state: GameObjectState;
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};
