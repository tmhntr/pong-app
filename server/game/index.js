const uuid = require("uuid").v4;
const Game = require("./game");
var io;
var gameSocket;

const currentGames = {};
const currentPlayers = {};

function purgeGames() {
  let gamesWithPlayers = Object.values(currentPlayers);
  Object.keys(currentGames).forEach((gid) => {
    if (!gamesWithPlayers.includes(currentGames[gid])) {
      delete currentGames[gid];
    }
  });
}

function playerLeaveGame(id) {
  console.log(`Player ${id} left the game`);
  let game = currentPlayers[id];
  if (game) {
    game.pause();
    if (id === game.left) {
      game.left = null;
    }
    if (id === game.right) {
      game.right = null;
    }
    delete currentPlayers[id];
  }
}

function initGame(sio, socket) {
  io = sio;
  gameSocket = socket;
  gameSocket.emit("connected", { message: "Connected successfully" });

  gameSocket.on("action", (data) => {
    // get current game
    let game = currentPlayers[socket.id];
    try {
      if (!game) throw { message: "Player is not in game" };
      // move paddle if playing
      if (game.state === "play") {
        let paddle = game.left == socket.id ? game.lpaddle : game.rpaddle;
        switch (data.action) {
          case 0:
            paddle.moveDown();
            break;
          case 1:
            paddle.stop();
            break;
          case 2:
            paddle.moveUp();
          default:
            break;
        }
        // send game update to client
        game.update();
        io.in(socket.id).emit("update", game.observe());
      }
    } catch (error) {
      gameSocket.emit("error", { message: error.message });
    }
  });

  gameSocket.on("newGame", () => {
    // create game id
    let gid = uuid();

    // greate new game
    let game = new Game();

    // add game to list of current games
    currentGames[gid] = game;

    // assign player to left paddle
    game.left = socket.id;

    // add player as current player
    currentPlayers[socket.id] = game;

    // add player to game room
    io.in(socket.id).socketsJoin(gid);

    // tell client success
    gameSocket.emit("newGameSuccess", { gid });
  });

  gameSocket.on("joinGame", ({ gid }) => {
    // get game using game id
    let game = currentGames[gid];
    try {
      // error if game doesn't exist
      if (!game) throw { message: `Game ${gid} does not exist` };

      // assign player to an open side
      if (!game.right) {
        game.right = socket.id;
      } else if (!game.left) {
        game.left = socket.id;
      }
      // error if game is full
      else {
        throw { message: "Game full" };
      }
      // tell other players a new player joined
      io.to(gid).emit("playerJoinedRoom", { playerName: socket.id.toString() });

      // add player to the room "gid"
      io.in(socket.id).socketsJoin(gid);

      // add player as current player
      currentPlayers[socket.id] = game;

      gameSocket.emit("joinGameSuccess", { gid });
      // start game if there are two players
      if (game.left && game.right) {
        console.log("starting game");
        game.start();
        console.log(game);
        io.to(gid).emit("update", game.observe());
      }
    } catch (error) {
      gameSocket.emit("joinGameFailed", { message: error.message });
    }
  });

  gameSocket.on("disconnect", (reason) => {
    playerLeaveGame(socket.id);
  });
}

module.exports = {
  initGame,
  purgeGames,
};
