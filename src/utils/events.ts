import { Action, Position } from "./game";

export interface ServerToClientEvents {
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  beginGame: () => void;
  update: (data: {
    ball: { position: Position; velocity: Position };
    lPaddle: Position;
    rPaddle: Position;
    score: { left: number; right: number };
  }) => void;
  joinGameFailed: (error: { message: string }) => void;
  joinGameSuccess: (gid: string) => void;
  newGameFailed: (error: { message: string }) => void;
  newGameSuccess: (gid: string) => void;
}

export interface ClientToServerEvents {
  action: (data: Action) => void;
  newGame: () => void;
  joinGame: (gid: string) => void;
}
