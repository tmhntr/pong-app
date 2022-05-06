import { Action, ServerUpdate } from "./Pong/types";

export interface ServerToClientEvents {
  connected: (data: { message: string }) => void;

  // game initialization
  joinGameSuccess: (data: { gid: string; pid: string }) => void;
  joinGameFailed: (error: { message: string }) => void;
  nameUpdate: (data: { left: string | null; right: string | null }) => void;

  // gameplay mechanics
  update: (data: { state: ServerUpdate }) => void;

  // end of game/error
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  // game initialization
  joinGame: (data: { gid: string; name: string }) => void;

  // gameplay
  clientAction: (data: { action: Action }) => void;
  requestUpdate: (data: { timestamp: number }) => void;
}
