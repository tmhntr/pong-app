import { Position } from "./clientGame/index";
import { io, Socket } from "socket.io-client";
import { clientGame } from "./clientGame";
import { v4 as uuid } from "uuid";

export interface ServerToClientEvents {
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  beginNewGame: () => void;
  update: (data: {
    ball: { position: Position; velocity: Position };
    lPaddle: Position;
    rPaddle: Position;
  }) => void;
}

export interface ClientToServerEvents {
  action: (data: { gid: string; action: 0 | 1 | 2 }) => void;
  newGame: (gid: string) => void;
  joinGame: (gid: string) => void;
}

export class IO {
  game: clientGame;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  gid: string | null;
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  beginNewGame: () => void;
  update: (data: any) => void;

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
      this.gid &&
        this.socket.emit("action", {
          gid: this.gid,
          action: game.getAction(),
        });
    };

    this.bindEvents();
  }

  /**
   * While connected, Socket.IO will listen to the following events emitted
   * by the Socket.IO server, then run the appropriate function.
   */
  bindEvents() {
    this.socket.on("connected", this.connected);
    // this.socket.on("newGameCreated", this.onNewGameCreated);
    this.socket.on("playerJoinedRoom", this.playerJoinedRoom);
    this.socket.on("playerLeftRoom", this.playerLeftRoom);
    this.socket.on("update", this.update);
    // this.socket.on("beginNewGame", this.beginNewGame);
    // this.socket.on("gameOver", this.gameOver);
    this.socket.on("error", this.error);
  }

  newGame() {
    this.gid = uuid();
    this.socket.emit("newGame", this.gid);
    console.log(`Starting new game with id: ${this.gid}`);
  }

  joinGame(gid: string) {
    console.log(`Joining game with id: ${gid}`);
    this.gid = gid;
    this.socket.emit("joinGame", this.gid);
  }
}
