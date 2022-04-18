import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "src/utils/events";
import { Side } from "src/utils/game/types";
import { v4 as uuid } from "uuid";
import ServerGame, { ServerAction } from "./game";
var io: Server<ClientToServerEvents, ServerToClientEvents>;
var gameSocket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  any
>;
type GameInstance = {
  updateInterval?: NodeJS.Timeout;
  game: ServerGame;
  left: string | null;
  right: string | null;
};
const currentInstances: {
  [index: string]: GameInstance;
} = {};
const currentPlayers: {
  [index: string]: { gameId: string | null; name: string | null };
} = {};

export function purgeGames() {
  Object.keys(currentInstances).forEach((gid) => {
    if (!currentInstances[gid].left && !currentInstances[gid].right) {
      let interval = currentInstances[gid].updateInterval;
      interval && clearInterval(interval);
      delete currentInstances[gid];
    }
  });
}

function playerLeaveGame(id: string) {
  if (currentPlayers[id]) {
    console.log(`Player ${currentPlayers[id].name} left the game`);
    let gameId = currentPlayers[id].gameId;
    if (gameId) {
      let instance = currentInstances[gameId];
      if (instance) {
        instance.game.pause();
        if (id === instance.left) {
          instance.left = null;
        }
        if (id === instance.right) {
          instance.right = null;
        }
        delete currentPlayers[id];
      }
    }
  }
}

export function initGame(sio: Server, socket: Socket) {
  io = sio;
  gameSocket = socket;
  let updateInterval: NodeJS.Timer;

  gameSocket.emit("connected", { message: "Connected successfully" });

  gameSocket.on("clientAction", (data) => {
    // get current game
    let gameId = currentPlayers[socket.id].gameId;
    if (gameId) {
      let instance = currentInstances[gameId];

      try {
        let serverAction: ServerAction = {
          player: socket.id === instance.left ? "left" : "right",
          payload: data.action.payload,
          timestamp: data.action.timestamp,
        };
        instance.game.actionBuffer.push(serverAction);
        // move paddle if playing
      } catch (error) {
        gameSocket.emit("error", { message: "An error occurred" });
      }
    }
  });

  gameSocket.on("newGame", ({ name }) => {
    // create game id
    let gid = uuid();

    // greate new game
    let instance: GameInstance = {
      game: new ServerGame(),
      left: null,
      right: null,
    };

    // add game to list of current games
    currentInstances[gid] = instance;

    // assign player to left paddle
    instance.left = socket.id;

    // add player as current player
    currentPlayers[socket.id] = { gameId: gid, name: name };

    // add player to game room
    io.in(socket.id).socketsJoin(gid);

    // tell client success
    gameSocket.emit("newGameSuccess", { gid, side: "left" });
  });

  gameSocket.on("joinGame", ({ gid, name }) => {
    // get game using game id
    let instance = currentInstances[gid];
    let side: Side;
    try {
      // error if game doesn't exist
      if (!instance) throw { message: `Game ${gid} does not exist` };

      // assign player to an open side
      if (!instance.right) {
        instance.right = socket.id;
        side = "right";
      } else if (!instance.left) {
        instance.left = socket.id;
        side = "left";
      }
      // error if game is full
      else {
        throw { message: "Game full" };
      }

      // tell other players a new player joined
      io.to(gid).emit("playerJoinedRoom", { playerName: name });

      // add player to the room "gid"
      io.in(socket.id).socketsJoin(gid);

      // add player as current player
      currentPlayers[socket.id] = { gameId: gid, name: name };

      gameSocket.emit("joinGameSuccess", { gid, side });
      // start game if there are two players
      if (instance.left && instance.right) {
        console.log("starting game");

        instance.game.play();
        instance.updateInterval = setInterval(() => {
          instance.game.update();
          io.to(gid).emit("update", { state: instance.game.state });
        });
      }
    } catch (error) {
      gameSocket.emit("joinGameFailed", {
        message: `Could not join game ${gid}`,
      });
    }
  });

  gameSocket.on("disconnect", (reason) => {
    playerLeaveGame(socket.id);
  });
}

// export default {
//   initGame,
//   purgeGames,
// };
