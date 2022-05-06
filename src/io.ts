import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import ClientGame from "./Pong/clientGame";

import { Action, ServerUpdate } from "./Pong/types";

export class IO {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  connected: (data: { message: string }) => void;
  error: (data: { message: string }) => void;
  update: (data: { state: ServerUpdate }) => void;
  joinGameSuccess: ({ gid, pid }: { gid: string; pid: string }) => void;
  nameUpdate: (data: { left: string | null; right: string | null }) => void;

  constructor(
    setNames: (names: { left: string | null; right: string | null }) => void,
    game: ClientGame
  ) {
    const socket = io();
    this.socket = socket;

    this.connected = (data: { message: string }) => {
      // game.setSocketId(this.socket.socket.sessionid);
      console.log(data.message);
    };

    this.nameUpdate = (data) => {
      setNames(data);
    };

    this.error = (data: { message: string }) => {
      alert(data.message);
    };

    this.update = ({ state }) => {
      game.pushState(state);

      // socket.emit("action", { action: game.getAction() });
    };

    this.joinGameSuccess = ({ gid, pid }: { gid: string; pid: string }) => {
      // console.log("join success: ", gid, pid);

      game.pid = pid;
    };

    this.bindEvents();
  }

  /**
   * While connected, Socket.IO will listen to the following events emitted
   * by the Socket.IO server, then run the appropriate function.
   */
  bindEvents() {
    this.socket.on("connected", this.connected);

    this.socket.on("joinGameSuccess", this.joinGameSuccess);
    this.socket.on("joinGameFailed", this.joinGameFailed);

    this.socket.on("nameUpdate", this.nameUpdate);

    this.socket.on("update", this.update);

    this.socket.on("error", this.error);
  }

  joinGame(gid: string, name: string) {
    this.socket.emit("joinGame", { gid, name });
  }

  joinGameFailed({ message }: { message: string }) {
    alert(message);
  }

  action(action: Action) {
    this.socket.emit("clientAction", { action });
  }
}
