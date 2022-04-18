import { Action, GameState, Side } from "./game/types";

export interface ServerToClientEvents {
  connected: (data: { message: string }) => void;

  // game initialization
  newGameSuccess: (data: { gid: string; side: Side }) => void;
  newGameFailed: (error: { message: string }) => void;
  joinGameSuccess: (data: { gid: string; side: Side }) => void;
  joinGameFailed: (error: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;

  // start the game
  beginGame: () => void;

  // gameplay mechanics
  serverAction: (data: { action: Action }) => void;
  update: (data: { state: GameState }) => void;

  // end of game/error
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  // game initialization
  newGame: (data: { name: string }) => void;
  joinGame: (data: { gid: string; name: string }) => void;

  // gameplay
  clientAction: (data: { action: Action }) => void;
  requestUpdate: (data: { timestamp: number }) => void;
}
