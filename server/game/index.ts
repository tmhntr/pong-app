import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "src/utils/events";
import { Side } from "src/utils/game/types";
import { v4 as uuid } from "uuid";
import ServerGame from "./game";
var io: Server<ClientToServerEvents, ServerToClientEvents>;
var gameSocket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  any
>;
type GameInstance = {
  sendUpdateInterval?: NodeJS.Timeout;
  updateInterval?: NodeJS.Timeout;
  game: ServerGame;
  left: Socket | null;
  right: Socket | null;
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
      let sendInterval = currentInstances[gid].sendUpdateInterval;
      sendInterval && clearInterval(sendInterval);
      let upInterval = currentInstances[gid].updateInterval;
      upInterval && clearInterval(upInterval);
      delete currentInstances[gid];
    }
  });
}

function playerLeaveGame(socket: Socket) {
  if (socket.id in currentPlayers) {
    console.log(`Player ${currentPlayers[socket.id].name} left the game`);
    let { gameId } = currentPlayers[socket.id];
    if (gameId) {
      let instance = currentInstances[gameId];
      if (instance) {
        instance.game.pause();
        if (socket === instance.left) {
          instance.left = null;
        }
        if (socket === instance.right) {
          instance.right = null;
        }
        delete currentPlayers[socket.id];
      }
    }
  }
}

export function initGame(sio: Server, socket: Socket) {
  io = sio;
  gameSocket = socket;

  gameSocket.emit("connected", { message: "Connected successfully" });

  gameSocket.on("clientAction", ({ action }) => {
    // get current game

    try {
      let { gameId } = currentPlayers[socket.id];
      if (gameId) {
        let instance = currentInstances[gameId];
        instance.game.actionQueue.push(action);
      }

      // move paddle if playing
    } catch (error) {
      gameSocket.emit("error", { message: "An error occurred" });
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
    instance.left = socket;

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
        instance.right = socket;
        side = "right";
      } else if (!instance.left) {
        instance.left = socket;
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
        instance.sendUpdateInterval = setInterval(() => {
          instance.left?.emit("update", {
            state: {
              entities: {
                ball: instance.game.entities.ball.state,
                left: instance.game.entities.left.state,
                right: instance.game.entities.right.state,
              },
              score: instance.game.score,
              status: instance.game.status,
              timestamp: Date.now(),
              index: instance.game.lastProcessedAction.left,
              nextBounce: instance.game.nextBounce,
            },
          });
          instance.right?.emit("update", {
            state: {
              entities: {
                ball: instance.game.entities.ball.state,
                left: instance.game.entities.left.state,
                right: instance.game.entities.right.state,
              },
              score: instance.game.score,
              status: instance.game.status,
              timestamp: Date.now(),
              index: instance.game.lastProcessedAction.left,
              nextBounce: instance.game.nextBounce,
            },
          });
          instance.game.nextBounce = undefined;
        }, 100);
        instance.updateInterval = setInterval(() => {
          instance.game.update();
        }, 50);
      }
    } catch (error) {
      gameSocket.emit("joinGameFailed", {
        message: `Could not join game ${gid}`,
      });
    }
  });

  gameSocket.on("disconnect", (reason) => {
    playerLeaveGame(socket);
  });
}

// export default {
//   initGame,
//   purgeGames,
// };
