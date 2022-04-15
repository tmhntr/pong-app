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
  update: (data: {
    ball: { position: Position; velocity: Position };
    lPaddle: Position;
    rPaddle: Position;
    score: { left: number; right: number };
  }) => void;
  newGameSuccess: ({ gid }: { gid: string }) => void;
  joinGameSuccess: ({ gid }: { gid: string }) => void;

  constructor(game: clientGame) {
    const socket = io();
    this.socket = socket;
    this.game = game;
    this.gid = null;

    this.connected = (data: { message: string }) => {
      // game.setSocketId(this.socket.socket.sessionid);
      console.log(data.message);
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
      socket.emit("action", { action: game.getAction() });
    };

    this.newGameSuccess = ({ gid }: { gid: string }): void => {
      game.gid = gid;
      let idtag = document.getElementById("gameId");
      if (idtag) idtag.innerHTML = `${gid}`;
    };
    this.joinGameSuccess = ({ gid }: { gid: string }) => {
      game.gid = gid;
      let idtag = document.getElementById("gameId");
      if (idtag) idtag.innerHTML = `${gid}`;
    };

    this.bindEvents();
  }

  /**
   * While connected, Socket.IO will listen to the following events emitted
   * by the Socket.IO server, then run the appropriate function.
   */
  bindEvents() {
    this.socket.on("connected", this.connected);

    this.socket.on("newGameSuccess", this.newGameSuccess);
    this.socket.on("joinGameSuccess", this.joinGameSuccess);

    this.socket.on("playerJoinedRoom", this.playerJoinedRoom);
    this.socket.on("playerLeftRoom", this.playerLeftRoom);
    this.socket.on("update", this.update);

    this.socket.on("error", this.error);
    this.socket.on("joinGameFailed", this.joinGameFailed);
    this.socket.on("newGameFailed", this.newGameFailed);
  }

  newGame() {
    this.socket.emit("newGame");
  }

  newGameFailed({ message }: { message: string }) {
    alert(message);
  }

  joinGame(gid: string) {
    this.socket.emit("joinGame", { gid: gid });
  }
  joinGameFailed({ message }: { message: string }) {
    alert(message);
  }
}
