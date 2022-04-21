import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { Action, GameState, Side } from "./game/types";
import ClientGame from "./game/clientGame";

export class IO {
  game: ClientGame;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  gid: string | null;
  connected: (data: { message: string }) => void;
  playerJoinedRoom: (data: { playerName: string }) => void;
  playerLeftRoom: () => void;
  error: (data: { message: string }) => void;
  update: (data: { state: GameState }) => void;

  newGameSuccess: ({ gid, side }: { gid: string; side: Side }) => void;
  joinGameSuccess: ({
    gid,
    side,
    opponentName,
  }: {
    gid: string;
    side: Side;
    opponentName?: string;
  }) => void;

  constructor(game: ClientGame) {
    const socket = io();
    this.socket = socket;
    this.game = game;
    this.gid = null;

    this.connected = (data: { message: string }) => {
      // game.setSocketId(this.socket.socket.sessionid);
      console.log(data.message);
    };

    this.playerJoinedRoom = (data) => {
      console.log(data);

      game.oponentName = data.playerName;
    };

    this.playerLeftRoom = () => {
      game.oponentName = null;
    };

    this.error = (data: { message: string }) => {
      alert(data.message);
    };

    this.update = ({ state }) => {
      game.serverUpdate(state);

      // socket.emit("action", { action: game.getAction() });
    };

    this.newGameSuccess = ({
      gid,
      side,
    }: {
      gid: string;
      side: Side;
    }): void => {
      console.log(gid);

      game.gid = gid;
      console.log(game);
      game.side = side;
      let idtag = document.getElementById("gameId");
      if (idtag) idtag.innerHTML = `${gid}`;
    };

    this.joinGameSuccess = ({
      gid,
      side,
      opponentName,
    }: {
      gid: string;
      side: Side;
      opponentName?: string;
    }) => {
      game.gid = gid;
      game.side = side;
      if (opponentName) game.oponentName = opponentName;
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
    this.socket.on("newGameFailed", this.newGameFailed);

    this.socket.on("joinGameSuccess", this.joinGameSuccess);
    this.socket.on("joinGameFailed", this.joinGameFailed);

    this.socket.on("playerJoinedRoom", this.playerJoinedRoom);

    this.socket.on("update", this.update);

    this.socket.on("playerLeftRoom", this.playerLeftRoom);
    this.socket.on("error", this.error);
  }

  newGame(name: string) {
    this.game.playerName = name;
    this.socket.emit("newGame", { name });
  }

  newGameFailed({ message }: { message: string }) {
    alert(message);
  }

  joinGame(gid: string, name: string) {
    this.game.playerName = name;
    this.socket.emit("joinGame", { gid, name });
  }
  joinGameFailed({ message }: { message: string }) {
    alert(message);
  }

  action(action: Action) {
    this.socket.emit("clientAction", { action });
  }
}
