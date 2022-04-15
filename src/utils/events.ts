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
  joinGameSuccess: (data: { gid: string }) => void;
  joinGameFailed: (error: { message: string }) => void;
  newGameSuccess: (data: { gid: string }) => void;
  newGameFailed: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  action: (data: { action: Action }) => void;
  newGame: () => void;
  joinGame: (data: { gid: string }) => void;
}
