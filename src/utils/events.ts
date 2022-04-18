import { Action, CoordinateData, GameState } from "./game/types";

export interface ServerToClientEvents {
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  beginGame: () => void;
  update: (data: GameState) => void;
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
