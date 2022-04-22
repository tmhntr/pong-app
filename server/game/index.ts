import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "src/events";
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

export function initGame(sio: Server, socket: Socket) {
  io = sio;
  gameSocket = socket;

  const sendNames = (gid: string) => {
    let instance = currentInstances[gid];
    if (instance) {
      let names = {
        left: instance.left ? currentPlayers[instance.left.id].name : null,
        right: instance.right ? currentPlayers[instance.right.id].name : null,
      };
      io.to(gid).emit("nameUpdate", names);
    }
  };

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

  gameSocket.on("joinGame", ({ gid, name }) => {
    // get game using game id
    // console.log(gid);
    try {
      let instance: GameInstance;

      if (gid in currentInstances) {
        console.log("joining game ", gid);

        instance = currentInstances[gid];
        // assign player to an open side
        if (!instance.left) {
          instance.left = socket;
          instance.game.entities[socket.id] = {
            x: 0,
            y: 0.5,
            actionIndex: -1,
            type: "paddle",
          };
        } else if (!instance.right) {
          instance.right = socket;
          instance.game.entities[socket.id] = {
            x: 1,
            y: 0.5,
            actionIndex: -1,
            type: "paddle",
          };
        }
        // error if game is full
        else {
          throw { message: "Game full" };
        }
      } else {
        console.log("creating new game ", gid);

        // greate new game
        // let gid = uuid().split("-")[0];

        instance = {
          game: new ServerGame(),
          left: null,
          right: null,
        };

        // add game to list of current games
        currentInstances[gid] = instance;

        // assign player to left paddle
        instance.left = socket;
        instance.game.entities[socket.id] = {
          x: 0,
          y: 0.5,
          actionIndex: -1,
          type: "paddle",
        };

        // add player as current player

        // add player to game room
      }

      currentPlayers[socket.id] = { gameId: gid, name: name };
      io.in(socket.id).socketsJoin(gid);
      gameSocket.emit("joinGameSuccess", {
        gid,
        pid: socket.id,
      });

      sendNames(gid);
      io.in(gid).emit("update", { state: instance.game.getServerState() });

      // start game if there are two players
      if (instance.left && instance.right) {
        console.log("starting game", gid);

        instance.game.play();
        let counter = 0;
        instance.updateInterval = setInterval(() => {
          instance.game.update();
          counter += 1;
          if (
            counter >
            instance.game.updateFrequency / instance.game.sendFrequency
          ) {
            counter = 0;
            io.in(gid).emit("update", {
              state: instance.game.getServerState(),
            });
          }
        }, 1000 / instance.game.updateFrequency);
      }
    } catch (error) {
      gameSocket.emit("joinGameFailed", {
        message: `Could not join game ${gid}`,
      });
    }
  });

  gameSocket.on("disconnect", (reason) => {
    if (currentPlayers[socket.id]) {
      let { gameId } = currentPlayers[socket.id];
      delete currentPlayers[socket.id];

      let instance = gameId ? currentInstances[gameId] : null;

      if (instance) {
        instance.game.pause();
        if (instance.left === socket) instance.left = null;
        if (instance.right === socket) instance.right = null;
        delete instance.game.entities[socket.id];
        if (instance.updateInterval) clearInterval(instance.updateInterval);
      }
    }
  });
}

// export default {
//   initGame,
//   purgeGames,
// };
