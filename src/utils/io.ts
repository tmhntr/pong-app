import { Position, Action, clientGame } from "./game";
import { io, Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { ClientToServerEvents, ServerToClientEvents } from "./events";

export class IO {
  game: clientGame;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  gid: string | null;
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  beginNewGame: () => void;
  update: (data: {
    ball: { position: Position; velocity: Position };
    lPaddle: Position;
    rPaddle: Position;
    score: { left: number; right: number };
  }) => void;

  constructor(game: clientGame) {
    this.socket = io();
    this.game = game;
    this.gid = null;

    this.connected = (data: { message: string }) => {
      // game.setSocketId(this.socket.socket.sessionid);
      console.log(data.message);
    };
    this.beginNewGame = () => {
      game.gameCountdown();
    };

    this.playerJoinedRoom = (data) => {
      game.oponentName = data.playerName;
    };

    this.playerLeftRoom = () => {
      game.oponentName = null;
    };

    this.error = (data: { message: string }) => {
      alert(data.message);
    };

    this.update = (data) => {
      game.update(data);
      this.socket.emit("action", game.getAction());
    };

    this.bindEvents();
  }

  /**
   * While connected, Socket.IO will listen to the following events emitted
   * by the Socket.IO server, then run the appropriate function.
   */
  bindEvents() {
    this.socket.on("connected", this.connected);
    this.socket.on("playerJoinedRoom", this.playerJoinedRoom);
    this.socket.on("playerLeftRoom", this.playerLeftRoom);
    this.socket.on("update", this.update);
    this.socket.on("error", this.error);
    this.socket.on("joinGameFailed", this.joinGameFailed);
  }

  newGame() {
    this.socket.emit("newGame");
    console.log(`Starting new game with id: ${this.gid}`);
  }

  newGameSuccess(gid: string) {
    this.game.gid = gid;
  }

  newGameFailed(error: { message: string }) {
    alert(error.message);
  }

  joinGame(gid: string) {
    this.socket.emit("joinGame", gid);
  }
  joinGameFailed(error: { message: string }) {
    alert(error.message);
  }
  joinGameSuccess(gid: string) {
    this.game.gid = gid;
  }
}
